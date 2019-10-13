from celery import Celery, chain
from celery.utils.log import get_task_logger
from celery.exceptions import CeleryError
from bs4 import BeautifulSoup
import requests
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
    result = pipeline.delay(message)


@celery.task
def request_html(message):
    print("Step 1")
    r = requests.get(message["url"])
    if r.status_code == 200:
        print("Retrieved HTML successfully")
        message["html_content"] = r.text
        return message
    else:
        # TODO make this a custom handled error so we can set error state on link
        print("FAILED to retrieve HTML")
        raise CeleryError('Error fetching html')


@celery.task
def get_content_from_html(message):
    print("Step 2")
    html_content = BeautifulSoup(message["html_content"], 'html.parser')
    body_content = html_content.body
    # Remove JS, CSS, and code blocks. Also remove header, and nav since those likely won't be relevant
    for element in body_content(["script", "style", "pre", "header", "footer", "nav"]):
        element.extract()  # rip it out
    message["text"] = body_content.get_text()
    return message


@celery.task
def get_keywords_from_content(message):
    print("Step 3")
    return message


@celery.task
def categorize_entity(message):
    print("Step 4")
    return message
