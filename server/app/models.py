from app import db


class Base(db.Model):
    """
    Base model to be inherited by all other models
    Includes ID and timestamps to reduce redundant column definitions
    """
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime,  default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime,  default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def serialize(self):
        """
        Serialize an SQLalchemy object into a dict
        :return: Dict if implemented, NotImplementedError if not implemented
        """
        raise NotImplementedError(f"You must implement the serialize function for the {type(self).__name__} model")


class Category(Base):
    """
    Entity representing a category
    Belongs to a single user - FK on user_id
    """
    __table_name__ = "Category"

    user_id = db.Column(db.String(36), nullable=False)
    category_name = db.Column(db.String(50), nullable=False)
    keywords = db.relationship('Keyword', backref='category', lazy='dynamic')

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category_name': self.category_name,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }


class Keyword(Base):
    """
    Entity representing a keyword
    Belongs to a category - FK on category_id
    """
    __table_name__ = "Keyword"

    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    keyword = db.Column(db.String, nullable=False)
    isExcluded = db.Column(db.Boolean, default=False)

    @property
    def serialize(self):
        pass
