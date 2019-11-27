from sqlalchemy.exc import SQLAlchemyError
from app.models import User


def export_user_data(user_id):
    try:
        user = User.query.filter_by(uuid=user_id).first()
        return user.export_serialization
    except SQLAlchemyError as e:
        raise SQLAlchemyError(e)
    except Exception as e:
        raise Exception(e)


def import_data(userID):
    pass
