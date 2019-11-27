from app import db
import enum
from datetime import datetime


class Base(db.Model):
    """
    Base model to be inherited by all other models
    Includes ID and timestamps to reduce redundant column definitions
    """
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime,  default=db.func.now())
    updated_at = db.Column(db.DateTime,  default=db.func.now(), onupdate=db.func.now())

    @property
    def serialized(self):
        """
        Serialize an SQLalchemy object into a dict
        :return: Dict if implemented, NotImplementedError if not implemented
        """
        raise NotImplementedError(f"You must implement the serialize function for the {type(self).__name__} model")


# Defines our many-to-many table, will be used for relationship between link and category
# Just a table, not a model
link_category = db.Table('link_category',
                         db.Column('category_id', db.Integer, db.ForeignKey('category.id'), primary_key=True),
                         db.Column('link_id', db.Integer, db.ForeignKey('link.id'), primary_key=True)
                         )


class ThirdPartyIntegration(enum.IntEnum):
    """ An enum to represent the third party integration being connected to """
    DEFAULT = 0
    TODOIST = 1
    POCKET = 2
    INSTAPAPER = 3


class Category(Base):
    """
    Entity representing a category
    Belongs to a single user - FK on user_id
    """
    __table_name__ = "Category"

    user_id = db.Column(db.String(36), db.ForeignKey('user.uuid'), nullable=False, )
    category_name = db.Column(db.String(50), nullable=False)
    is_archived = db.Column(db.Boolean, default=False)
    forwarding_app = db.Column(db.Enum(ThirdPartyIntegration), default=ThirdPartyIntegration.DEFAULT)
    forwarding_url = db.Column(db.String(250))
    keywords = db.relationship('Keyword', backref='category', lazy='dynamic', cascade="delete")
    links = db.relationship('Link',
                            secondary=link_category,
                            lazy='subquery',
                            backref=db.backref('categories', lazy=True)
                            )

    @property
    def user_serialized(self):
        return {
            'id': self.id,
            'category_name': self.category_name,
            'is_archived': self.is_archived,
            'link_count': len(self.links)
        }

    @property
    def export_serialized(self):
        return {
            'name': self.category_name,
            'keywords': [keyword.export_serialized for keyword in self.keywords]
        }

    @property
    def serialized(self):
        keywords_list = []
        for row in self.keywords:
            keywords_list.append({
                "id": row.id,
                "keyword": row.keyword,
                "is_excluded": row.is_excluded
            })
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category_name': self.category_name,
            'is_archived': self.is_archived,
            'forwarding_app': self.forwarding_app,
            'forwarding_url': self.forwarding_url,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'keywords': keywords_list
        }


class Keyword(Base):
    """
    Entity representing a keyword
    Belongs to a category - FK on category_id
    """
    __table_name__ = "Keyword"

    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    keyword = db.Column(db.String, nullable=False)
    is_excluded = db.Column(db.Boolean, default=False)

    @property
    def export_serialized(self):
        return {
            'keyword': self.keyword,
            'is_excluded': self.is_excluded
        }

    @property
    def serialized(self):
        return {
            'id': self.id,
            'category_id': self.category_id,
            'keyword': self.keyword,
            'is_excluded': self.is_excluded,
        }


class User(Base):
    """
    Entity representing a user
    UUID represents firebase ID
    email probably overkill
    """
    __table_name__ = "User"

    uuid = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    links = db.relationship('Link', backref='user', lazy='dynamic')
    categories = db.relationship('Category', backref='user', lazy='dynamic')
    forwarding_settings = db.relationship('ForwardingSettings', backref='user', lazy='dynamic')
    default_integration = db.Column(db.Enum(ThirdPartyIntegration))

    @property
    def export_serialization(self):
        return {
            'export_from': self.uuid,
            'export_time': datetime.now(),
            'categories': [category.export_serialized for category in self.categories]
        }

    @property
    def serialized(self):
        return {
            'id': self.id,
            'uuid': self.uuid,
            'email': self.email,
            'categories': [category.user_serialized for category in self.categories],
            'forwarding_settings': [forwarding_setting.serialized for forwarding_setting in self.forwarding_settings],
            'default_integration' : self.default_integration
        }


class ForwardingSettings(Base):
    """
    Entity representing a forwarding setting
    Belongs to a single user
    """
    __table_name__ = "ForwardingSettings"

    user_id = db.Column(db.String, db.ForeignKey('user.uuid'), nullable=False)
    forwarding_app = db.Column(db.Enum(ThirdPartyIntegration)) #TODO: don't allow to set to DEFAULT
    api_key = db.Column(db.String(100))
    default_forwarding_url = db.Column(db.String(100))

    @property
    def serialized(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'forwarding_app': self.forwarding_app,
            'api_key': self.api_key,
            'default_forwarding_url': self.default_forwarding_url
        }


class ProcessingState(enum.IntEnum):
    """ An enum to represent the state of processing for a link """
    UNPROCESSED = 0
    PROCESSED = 1
    ERROR = 2
    FORWARDED = 3


class Link(Base):
    """
    Entity representing a link
    Belongs to a single user
    Belongs to many (or none) categories
    """
    __table_name__ = "Link"

    user_id = db.Column(db.String, db.ForeignKey('user.uuid'), nullable=False)
    url = db.Column(db.String(1024), nullable=False)
    link_title = db.Column(db.String(128))
    link_description = db.Column(db.String(1024))
    is_marked_as_read = db.Column(db.Boolean, default=False)
    processing_state = db.Column(db.Enum(ProcessingState), default=ProcessingState.UNPROCESSED)
    relevant_keywords = db.relationship('RelevantKeyword', backref='link', lazy='dynamic')

    @property
    def serialized(self):
        categories_list = []
        for row in self.categories:
            categories_list.append({
                "id": row.id,
                "category_name": row.category_name
            })
        return {
            'id': self.id,
            'user_id': self.user_id,
            'url': self.url,
            'link_title': self.link_title,
            'link_description': self.link_description,
            'is_marked_as_read': self.is_marked_as_read,
            'processing_state': self.processing_state,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'categories': categories_list
        }


class RelevantKeyword(Base):
    __table_name__ = "Relevant_Keyword"
    keyword = db.Column(db.String(200), nullable=False)
    relevance = db.Column(db.Float, nullable=False)
    did_match = db.Column(db.Boolean, default=False)
    link_id = db.Column(db.Integer, db.ForeignKey('link.id'), nullable=False)

    @property
    def serialized(self):
        return {
            'keyword': self.keyword,
            'relevance': self.relevance,
            'did_match': self.did_match
        }
