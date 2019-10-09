from app import models
from app import db


def main():
# add user
    user = models.User(
        uuid='aaabbbcccddd',
        email='test@uoguelph.ca'
    )
    db.session.add(user)

    music_category = models.Category(
        category_name='Music',
        is_archived=False,
        user_id='aaabbbcccddd'
    )
    tech_category = models.Category(
        category_name='Tech',
        is_archived=False,
        user_id='aaabbbcccddd'
    )
    db.session.add(music_category)
    db.session.add(tech_category)
    db.session.commit()

    # keywords for music
    drum_keyword = models.Keyword(
        category_id=music_category.id,
        keyword="drum"
    )
    bass_keyword = models.Keyword(
        category_id=music_category.id,
        keyword="bass"
    )
    db.session.add(drum_keyword)
    db.session.add(bass_keyword)

    js_keyword = models.Keyword(
        category_id=tech_category.id,
        keyword='javascript'
    )
    sql_keyword = models.Keyword(
        category_id=tech_category.id,
        keyword='SQL'
    )
    web_keyword = models.Keyword(
        category_id=tech_category.id,
        keyword='web'
    )
    db.session.add(js_keyword)
    db.session.add(sql_keyword)
    db.session.add(web_keyword)

    db.session.commit()


if __name__ == '__main__':
    main()
