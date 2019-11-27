from flask import Blueprint, request
from app.models import Link, Category, ProcessingState
from app.services.APIResponseBuilder import APIResponseBuilder
from sqlalchemy.exc import SQLAlchemyError
from app.tasks.tasks import process_link
from app import db
import json


link_controller = Blueprint("link_controller", __name__)


@link_controller.route('/<link_id>', methods=["GET"])
def get_link_by_id(link_id):
    """
    Returns a JSON response of a single link with id of link_id
    Includes all categories associated with that link

    :param  link_id: ID of the specific link to be found
    :return: JSON response
    """
    try:
        link = Link.query.get(link_id)
        if link:
            return APIResponseBuilder.success({
                "link": link
            })
        return APIResponseBuilder.failure({
            "invalid_id": f"No link with id {link_id} found"
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@link_controller.route('/', methods=["POST"])
def create_link():
    """ Create a new link for a given user 
    
    :return: JSON of new link if successful, error response if not
    """
    # TODO: validate user ID
    try:
        data = request.json
        # See if this specific user has a link entity with this specific url
        # This should prevent a link from being added twice but also run it through regardless
        link = Link.query.filter_by(user_id=data['user_id'], url=data['url']).first()
        if not link:
            link = Link(
                user_id=data['user_id'],
                url=data['url'],
            )
            db.session.add(link)
            db.session.commit()
        process_link(link)
        return APIResponseBuilder.success({
            "link": link
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@link_controller.route('/<link_id>', methods=["PATCH"])
def update_link_info_by_id(link_id):
    """
    Update the info of a link represented by link_id.
    Attributes that can change:
    link_title: the title of the article
    link_description: a description of the link

    :param link_id: ID of the link to be updated
    :return: JSON response with the updated link entity
    """
    try:
        data = request.json
        link = Link.query.get(link_id)
        if link:
            link.link_title = data['link_title']
            link.link_description = data['link_description']
            db.session.commit()
            return APIResponseBuilder.success({
                "link": link
            })
        else:
            return APIResponseBuilder.failure({
                "invalid_id": f"Unable to find link with ID of {link_id}"
            })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@link_controller.route('/<link_id>/categories', methods=["PATCH"])
def update_link_categories_by_id(link_id):
    """
    Update the categories of a link represented by link_id.
    Attributes that can change:
    categories: The new list of category ids that the link belongs to

    :param link_id: ID of the link to be updated
    :return: JSON response with the updated link entity
    """
    try:
        data = request.json
        link = Link.query.get(link_id)
        if link:
            for category_id in json.loads(data['categories']):
                category = Category.query.filter_by(id=category_id).first()
                if category:
                    link.categories.append(category)
                else:
                    return APIResponseBuilder.failure({
                        "invalid_id": f"Unable to find category with ID of {category_id}"
                    })
            link.processing_state = ProcessingState.PROCESSED
            db.session.commit()
            return APIResponseBuilder.success({
                "link": link
            })
        else:
            return APIResponseBuilder.failure({
                "invalid_id": f"Unable to find link with ID of {link_id}"
            })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@link_controller.route("/<link_id>", methods=["DELETE"])
def delete_link_by_id(link_id):
    """
    Delete a link with id link_id
    :param link_id:
    :return: JSON boolean representing whether the user was successfully create
    """
    try:
        link = Link.query.filter_by(id=link_id).delete()
        db.session.commit()
        if link:
            return APIResponseBuilder.success({
                "deleted": True
            })
        return APIResponseBuilder.failure({
            "invalid_id": f"Unable to delete link with ID {link_id}"
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@link_controller.route('/<link_id>/mark_as_read', methods=['PATCH'])
def mark_link_as_read(link_id):
    """
    Marks a specific link as read identified by link_id

    :param link_id: ID of the Link object to be marked as read
    :return: JSON response of the updated link
    """
    # TODO: validate user ID from post param - for now we'll assume it's the correct user
    try:
        link = Link.query.get(link_id)
        if link:
            link.is_marked_as_read = True
            db.session.commit()
            return APIResponseBuilder.success({
                "link": link,
            })
        else:
            return APIResponseBuilder.failure({
                "invalid_id": f"Unable to find link with ID of {link_id}"
            })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@link_controller.route('/<link_id>/mark_as_unread', methods=['PATCH'])
def mark_link_as_unread(link_id):
    """
    Marks a specific link as unread identified by link_id

    :param link_id: ID of the link to be marked as unread
    :return: JSON object of updated Link
    """
    # TODO: validate user ID from post param - for now we'll assume it's the correct user
    try:
        link = Link.query.get(link_id)
        if link:
            link.is_marked_as_read = False
            db.session.commit()
            return APIResponseBuilder.success({
                "link": link,
            })
        else:
            return APIResponseBuilder.failure({
                "invalid_id": f"Unable to find link with ID of {link_id}"
            })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@link_controller.route('/<link_id>/categorize', methods=['GET'])
def categorize_link(link_id):
    """
    Categorizes a link by link_id

    :param link_id: ID of the link to be marked as unread
    """
    # TODO: validate user ID
    try:
        link = Link.query.get(link_id)
        if link:
            link.processing_state = ProcessingState.UNPROCESSED
            link.categories = []
            db.session.add(link)
            db.session.commit()
            process_link(link)
            return APIResponseBuilder.success({
                "link": link
            })
        else:
            return APIResponseBuilder.failure({
                "invalid_id": f"Unable to find link with ID of {link_id}"
            })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


@link_controller.route('/<link_id>/categorize', methods=['POST'])
def recategorize_link(link_id):
    try:
        data = request.json
        link = Link.query.get(link_id)
        if link:
            link.categories = []  # Remove all current relations
            to_add = [category for category in data if category["is_categorized_as"] is True]
            for category_to_add in to_add:
                category = Category.query.get(category_to_add["id"])
                link.categories.append(category)
            db.session.commit()
        else:
            return APIResponseBuilder.failure({
                "invalid_id": f"Unable to find link with ID of {link_id}"
            })
        return APIResponseBuilder.success({
            "link": link
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        print(e)
        return APIResponseBuilder.error(f"Error encountered: {e}")

