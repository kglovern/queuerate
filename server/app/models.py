from app import db


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


class Category(Base):
    """
    Entity representing a category
    Belongs to a single user - FK on user_id
    """
    __table_name__ = "Category"

    user_id = db.Column(db.String(36), nullable=False)
    category_name = db.Column(db.String(50), nullable=False)
    is_archived = db.Column(db.Boolean, default=False)
    keywords = db.relationship('Keyword', backref='category', lazy='dynamic')

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
    def serialized(self):
        return {
            'id': self.id,
            'category_id': self.category_id,
            'keyword': self.keyword,
            'is_excluded': self.is_excluded,
        }
