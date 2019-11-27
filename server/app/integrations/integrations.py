import todoist
import random

random.seed()

def getInboxProject(project):
    return "inbox_project" in project and project["inbox_project"] == True

def convertToValidTodoistName(name):
    return name.replace(" ", "_")

def forwardLinkToTodoist(url, user_api_token, project_id, labels):
    api = todoist.TodoistAPI(user_api_token)
    api.sync()

    try:
        inbox_project = list(filter(lambda project: getInboxProject(project), api.state["projects"]))[0]
        print(inbox_project)
    except Exception as e:
        print(f"Could not get inbox project: {e}")
        return

    labelsInTodoist = api.state["labels"]
    print(labelsInTodoist)
    print("labels", labels)

    for label in labels:
        if convertToValidTodoistName(label) in (todoistLabel["name"] for todoistLabel in labelsInTodoist):
            continue
        api.labels.add(label, color=random.randint(30, 49))
    api.commit()

    labelsInTodoist = api.state["labels"]
    print(labelsInTodoist)
    labelIDs = []
    for label in labels:
        for todoistLabel in labelsInTodoist:
            if convertToValidTodoistName(label) == todoistLabel["name"]:
                print(todoistLabel["id"])
                labelIDs.append(todoistLabel["id"])
                break
    print("ids", labelIDs)
    project_id = inbox_project["id"]
    item = api.items.add(url, labels=labelIDs, project_id=project_id)
    api.commit()
