from flask import Blueprint, request
from app.models import Link, ProcessingState
from app.services.APIResponseBuilder import APIResponseBuilder
from sqlalchemy.exc import SQLAlchemyError
from app import db


link_controller = Blueprint("link_controller", __name__)


@link_controller.route('/', methods=["GET"])
def get_all_links():
    """
    Returns a JSON response of all links in the system
    Does not include associated categories
    """
    try:
        links = Link.query.all()
        return APIResponseBuilder.success({
            "links": links
        })
    except SQLAlchemyError as e:
        return APIResponseBuilder.error(f"Issue running query: {e}")
    except Exception as e:
        return APIResponseBuilder.error(f"Error encountered: {e}")


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
        data = request.form.to_dict()
        link = Link(
            user_id=data['user_id'],
            url=data['url'],
        )
        db.session.add(link)
        db.session.commit()
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
        data = request.form.to_dict()
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
    categories: The new list of categories that the link belongs to

    :param link_id: ID of the link to be updated
    :return: JSON response with the updated link entity
    """
    try:
        data = request.form.to_dict()
        link = Link.query.get(link_id)
        if link:
            link.categories = data['categories']
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


@link_controller.route('/<link_id>/processing_state/<processing_state>', methods=["PATCH"])
def update_link_processing_state(link_id, processing_state):
    """
    Update a links processing state.
    Attributes: processing_state: the updated processing state for the link

    :param link_id: ID of the link to be updated
    :return: JSON response with the updated link entity
    """
    try:
        data = request.form.to_dict()
        link = Link.query.get(link_id)
        if link:
            link.processing_state = processing_state
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
    raise NotImplementedError("Replay not yet implemented.")

