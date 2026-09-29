"""Builds the ABApp shortcut. Run from this folder, then sign it:
    python3 build_abapp_shortcut.py
    shortcuts sign --mode anyone --input ABApp.unsigned.shortcut --output ABApp.shortcut
DEBUG=1 adds a request to http://localhost:8766/cpNN before each action, to find
which action fails when run with `shortcuts run`.
"""
import plistlib, uuid

ACTIONS_URL = "https://lucianrain.github.io/TrackingApp/actions.json?t="
actions = []


def new_id():
    return str(uuid.uuid4()).upper()


def out(uid, name):
    return {"Type": "ActionOutput", "OutputUUID": uid, "OutputName": name}


REPEAT_ITEM = {"Type": "Variable", "VariableName": "Repeat Item"}
SHORTCUT_INPUT = {"Type": "ExtensionInput"}


def attach(var):
    return {"Value": var, "WFSerializationType": "WFTextTokenAttachment"}


def tokens(*parts):
    s, att = "", {}
    for p in parts:
        if isinstance(p, str):
            s += p
        else:
            att["{%d, 1}" % (len(s.encode("utf-16-le")) // 2)] = p
            s += "￼"
    return {"Value": {"string": s, "attachmentsByRange": att}, "WFSerializationType": "WFTextTokenString"}


import os
DEBUG = os.environ.get("DEBUG") == "1"
checkpoint = [0]


def add(identifier, params, name=None):
    is_block_end = params.get("WFControlFlowMode") in (1, 2)
    if DEBUG and not is_block_end:
        checkpoint[0] += 1
        actions.append({"WFWorkflowActionIdentifier": "is.workflow.actions.downloadurl", "WFWorkflowActionParameters": {
            "UUID": new_id(), "WFHTTPMethod": "GET",
            "WFURL": "http://localhost:8766/cp%02d-%s" % (checkpoint[0], identifier.split(".")[-1])}})
    uid = new_id()
    params = dict(params, UUID=uid)
    if name:
        params["CustomOutputName"] = name
    actions.append({"WFWorkflowActionIdentifier": identifier, "WFWorkflowActionParameters": params})
    return out(uid, name) if name else None


def comment(text):
    add("is.workflow.actions.comment", {"WFCommentActionText": text})


def get_value(source, key, name):
    key_param = tokens(*key) if isinstance(key, tuple) else key
    return add(
        "is.workflow.actions.getvalueforkey",
        {"WFInput": attach(source), "WFDictionaryKey": key_param, "WFGetDictionaryValueType": "Value"},
        name,
    )


def set_var(name, value):
    add("is.workflow.actions.setvariable", {"WFVariableName": name, "WFInput": attach(value)})


def notify(title, body):
    add(
        "is.workflow.actions.notification",
        {"WFNotificationActionTitle": title, "WFNotificationActionBody": body, "WFNotificationActionSound": True},
    )


def fetch(url_tokens, name):
    return add("is.workflow.actions.downloadurl", {"WFURL": url_tokens, "WFHTTPMethod": "GET"}, name)


class If:
    """If <var> <condition> [string] ... Otherwise ... End If"""

    def __init__(self, var, condition, string=None):
        self.group = new_id()
        params = {
            "GroupingIdentifier": self.group,
            "WFControlFlowMode": 0,
            "WFCondition": condition,
            "WFInput": {"Type": "Variable", "Variable": attach(var)},
        }
        if string is not None:
            params["WFConditionalActionString"] = string
        add("is.workflow.actions.conditional", params)

    def otherwise(self):
        add("is.workflow.actions.conditional", {"GroupingIdentifier": self.group, "WFControlFlowMode": 1})

    def end(self, name=None):
        return add("is.workflow.actions.conditional", {"GroupingIdentifier": self.group, "WFControlFlowMode": 2}, name)


HAS_VALUE = 100

# --- Setup ---------------------------------------------------------------
comment(
    "ABApp: runs a command from the app's actions.json.\n"
    "Input: the command name (e.g. test). Put your private keys in Secrets below; "
    "they stay on your devices and are never in the app or on GitHub."
)
secrets = add(
    "is.workflow.actions.dictionary",
    {
        "WFItems": {
            "Value": {
                "WFDictionaryFieldValueItems": [
                    {"WFItemType": 0, "WFKey": tokens("voicemonkey"), "WFValue": tokens("")},
                ]
            },
            "WFSerializationType": "WFDictionaryFieldValue",
        }
    },
    "Secrets",
)
command_name = add("is.workflow.actions.gettext", {"WFTextActionText": tokens(SHORTCUT_INPUT)}, "Command Name")
stamp = add(
    "is.workflow.actions.format.date",
    {"WFDateFormatStyle": "Custom", "WFDateFormat": "yyyyMMddHHmmss", "WFDate": tokens({"Type": "CurrentDate"})},
    "Stamp",
)
# The timestamp stops a cached copy of actions.json from being used.
contents = fetch(tokens(ACTIONS_URL, stamp), "Actions File")
all_actions = add("is.workflow.actions.detect.dictionary", {"WFInput": attach(contents)}, "Actions")
command = get_value(all_actions, (command_name,), "Command")

# --- Run the command's steps ----------------------------------------------
found = If(command, HAS_VALUE)
steps = get_value(command, "steps", "Steps")
loop_group = new_id()
add("is.workflow.actions.repeat.each", {"GroupingIdentifier": loop_group, "WFControlFlowMode": 0, "WFInput": attach(steps)})
# Each step is {"notify": {...}} or {"request": {...}}. Only "has any value"
# checks are used: text comparisons in hand-built shortcuts fail to run.
notify_step = get_value(REPEAT_ITEM, "notify", "Notify Step")
is_notify = If(notify_step, HAS_VALUE)
title = get_value(notify_step, "title", "Title")
body = get_value(notify_step, "body", "Body")
notify(tokens(title), tokens(body))
is_notify.end()

request_step = get_value(REPEAT_ITEM, "request", "Request Step")
is_request = If(request_step, HAS_VALUE)
url = get_value(request_step, "url", "URL")
set_var("Request URL", url)
secret_name = get_value(request_step, "secret", "Secret Name")
has_secret = If(secret_name, HAS_VALUE)
secret = get_value(secrets, (secret_name,), "Secret")
filled = add(
    "is.workflow.actions.text.replace",
    {
        "WFInput": tokens(url),
        "WFReplaceTextFind": "{secret}",
        "WFReplaceTextReplace": tokens(secret),
        "WFReplaceTextCaseSensitive": True,
        "WFReplaceTextRegularExpression": False,
    },
    "Filled URL",
)
set_var("Request URL", filled)
has_secret.end()
fetch(tokens({"Type": "Variable", "VariableName": "Request URL"}), "Response")
is_request.end()

add("is.workflow.actions.repeat.each", {"GroupingIdentifier": loop_group, "WFControlFlowMode": 2})
found.otherwise()
notify("ABApp", tokens("Unknown command: ", command_name))
found.end()

workflow = {
    "WFWorkflowMinimumClientVersion": 900,
    "WFWorkflowMinimumClientVersionString": "900",
    "WFWorkflowIcon": {"WFWorkflowIconStartColor": 431817727, "WFWorkflowIconGlyphNumber": 59511},
    "WFWorkflowImportQuestions": [],
    "WFWorkflowTypes": [],
    "WFWorkflowInputContentItemClasses": ["WFStringContentItem"],
    "WFWorkflowHasShortcutInputVariables": True,
    "WFWorkflowOutputContentItemClasses": [],
    "WFWorkflowActions": actions,
}
with open(os.environ.get("OUT", "ABApp.unsigned.shortcut"), "wb") as f:
    plistlib.dump(workflow, f, fmt=plistlib.FMT_BINARY)
print(len(actions), "actions")
