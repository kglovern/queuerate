from celery import Celery, chain
from celery.utils.log import get_task_logger
from celery.exceptions import CeleryError
from bs4 import BeautifulSoup
from app.models import Category, Link, ProcessingState
from app import db
import requests
import pke
import re

logger = get_task_logger(__name__)


# Setup celery connection
celery = Celery('curations', broker='pyamqp://guest@localhost/')
#celery.conf.update(app.config)


def process_link(link):
    message = {
        "url": link.url,
        "uuid": link.user_id,
        "link_id": link.id,
        "html_content": None,
        "text": None,
        "keywords": []
    }
    pipeline = chain(
        request_html.s(),
        get_content_from_html.s(),
        get_keywords_from_content.s(),
        categorize_entity.s(),
    )
    print("Kicking off ")
    pipeline.delay(message)


@celery.task
def request_html(message):
    print(f"Step 1: processing {message['url']}")
    try:
        r = requests.get(message["url"])
        if r.status_code == 200:
            print("Retrieved HTML successfully")
            message["html_content"] = r.text
            return message
        else:
            link = Link.query.get(message["link_id"])
            link.processing_state = ProcessingState.ERROR
            db.session.commit()
            print("FAILED to retrieve HTML")
            raise CeleryError('Error fetching html')
    except Exception as e:
        link = Link.query.get(message["link_id"])
        link.processing_state = ProcessingState.ERROR
        db.session.commit()


@celery.task
def get_content_from_html(message):
    print("Step 2 - parsing HTML")
    html_content = BeautifulSoup(message["html_content"], 'html.parser')
    # Get title and description (eventually)
    link_title = html_content.title.string
    link = Link.query.get(message["link_id"])
    link.link_title = link_title
    db.session.commit()
    body_content = html_content.body
    # Remove JS, CSS, and code blocks. Also remove header, and nav since those likely won't be relevant
    for element in body_content(["script", "style", "pre", "header", "footer", "nav"]):
        element.extract()  # rip it out
    message["text"] = body_content.get_text()
    return message


@celery.task
def get_keywords_from_content(message):
    print("Step 3 - extracting keywords")
    pos = {'NOUN', 'PROPN', 'ADJ', 'VERB'}

    extractor = pke.unsupervised.TopicRank()
    extractor.load_document(input=message["text"], language='en')

    extractor.candidate_selection()

    extractor.candidate_weighting()
    keywords = extractor.get_n_best(n=15)  # wide net cast
    message["keywords"] = keywords
    return message


@celery.task
def categorize_entity(message):
    print("Step 4 - matching keywords")
    key_dict = map_keywords_to_dict(message["keywords"])
    print(key_dict)
    user_categories = Category.query.filter_by(user_id=message["uuid"]).all()

    link = Link.query.get(message["link_id"])
    # TODO: Validate we received a link

    for category in user_categories:
        add_link_to_category = False
        for cat_keyword in category.keywords:
            p = None
            if len(cat_keyword.keyword) < 3:  # handle short phrases more gracefully
                p = re.compile(f"\b{cat_keyword.keyword}\b", re.IGNORECASE)
            else:
                p = re.compile(f"{cat_keyword.keyword}", re.IGNORECASE)
            if sum(1 for _ in filter(p.search, key_dict.keys())):
                if not cat_keyword.is_excluded:
                    print(f"Found matching non-excluded keyword - {cat_keyword.keyword}")
                    add_link_to_category = True
                else:
                    add_link_to_category = False
                    break
        if add_link_to_category:
            category.links.append(link)  # should set up relationship correctly
    # Update status to processed
    link.processing_state = ProcessingState.PROCESSED
    db.session.commit()
    return message


def map_keywords_to_dict(keywords):
    """
    Exactly what's on the box - given the array of arrays from PKE, return a dict where the keyword
    is the key and the value is the relevance

    :param keywords: array of keyword/relevancy arrays
    :return: dict
    """
    key_dict = {}
    for keyword in keywords:
        key_dict[keyword[0]] = keyword[1]
    return key_dict
