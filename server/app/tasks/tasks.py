from celery import Celery, chain
from celery.utils.log import get_task_logger
from celery.exceptions import CeleryError
from bs4 import BeautifulSoup
from app.models import Category, Link, ProcessingState, RelevantKeyword, User, ForwardingSettings, ThirdPartyIntegration
from app.integrations import integrations
from app import db
import requests
import pke
import re
import string

logger = get_task_logger(__name__)


# Setup celery connection

celery = Celery('curations', broker="pyamqp://guest@localhost/")
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
        forward_link.s(),
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
    punctuation_table = str.maketrans(dict.fromkeys(string.punctuation))
    key_dict = map_keywords_to_dict(message["keywords"])
    print(key_dict)
    user_categories = Category.query.filter_by(user_id=message["uuid"], is_archived=False).all()

    link = Link.query.get(message["link_id"])

    # Insert all relevant keywords for a link - false as default, we can make them true later
    # Reset keywords so they aren't duplicated when re-run
    for rk in link.relevant_keywords:
        db.session.delete(rk)
    db.session.commit()
    for keyword in key_dict.keys():
        rk = RelevantKeyword(keyword=keyword,
                             link_id=link.id,
                             relevance=key_dict[keyword],
                             did_match=False)
        link.relevant_keywords.append(rk)
    db.session.commit()

    for category in user_categories:
        add_link_to_category = False
        for cat_keyword in category.keywords:
            # Remove punctuation - this doesn't include UTF8 to note for future
            sanitized_keyword = str.lower(cat_keyword.keyword.translate(punctuation_table))
            p = re.compile(r"\b(%s)\b" % sanitized_keyword, re.IGNORECASE)  # always look for keyword atomically
            filtered_keywords = list(filter(p.search, key_dict.keys()))
            if len(filtered_keywords) > 0:
                if not cat_keyword.is_excluded:
                    print(f"Found matching non-excluded keyword - {cat_keyword.keyword}")
                    add_link_to_category = True
                else:
                    print(f"Found matching exclusive keyword - {cat_keyword.keyword}")
                    add_link_to_category = False
                    break
        if add_link_to_category:
            category.links.append(link)  # should set up relationship correctly
    # Update status to processed
    link.processing_state = ProcessingState.PROCESSED
    db.session.commit()
    return message

@celery.task
def forward_link(message):
    fs = None
    link = Link.query.get(message["link_id"])
    print(link.serialized)
    user = User.query.filter_by(uuid=link.user_id).first()
    try:
        fs = user.forwarding_settings.filter_by(forwarding_app=user.default_integration).first()
        print(fs)
    except Exception as e:
        print("No existing third party integration for user. ", e)
    integrationType = fs.forwarding_app

    if integrationType == ThirdPartyIntegration.TODOIST:
        categoryNames = [category.category_name for category in link.categories]
        integrations.forwardLinkToTodoist(link.url, 
            fs.api_key,
            fs.default_forwarding_url,
            categoryNames
            ) 
    else:
        print(f"Unsupported Third Party Integration {integrationType}")
        return
    link.processing_state = ProcessingState.FORWARDED
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

