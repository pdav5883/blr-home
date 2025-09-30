#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import boto3
from datetime import datetime, UTC

from botocore.exceptions import ClientError


"""
event = {"Records": [{"Sns": {"Message": emailbatch}}]}

emailbatch: {"typ": t , "content": {}, "recipients": [pname1, pname2,...]}
    welcome: year, compname
    newround: year, compname, pick_round
"""

root_url = SUB_DeployedRootURL # type: ignore
ses_identity = SUB_SesIdentity # type: ignore

ses = boto3.client("ses")

def lambda_handler(event, context):
    """
    SNS topic subscription
    """

    # each msg is a batch of emails all to players in the same typ/year/compname combo
    for msg in event["Records"]:
        batch = json.loads(msg["Sns"]["Message"])

        # populate other content
        email_type = batch["typ"]
        content = batch["content"]

        if email_type == "verify":
            content["verify_url"] = f"https://{root_url}/{content['verify_path']}"
            
        for name, email in zip(batch["recipient_names"], batch["recipient_emails"]):
            content["name"] = name.split(" ")[0] # first name only
            # Add timestamp to content
            content["timestamp"] = datetime.now(UTC).strftime("%Y-%m-%d %H:%M:%S UTC")

            subject = templates[email_type]["subject"]
            body = templates[email_type]["body"]

            for key, val in content.items():
                subject = subject.replace("{{" + key + "}}", str(val))
                body = body.replace("{{" + key + "}}", str(val))     
            try:
                ses.send_email(Source=f"bear@{ses_identity}",
                                Destination={"ToAddresses": [email]},
                                Message={"Subject": {"Data": subject},
                                        "Body": {"Html": {"Data": body}}
                                }
                      )
                print(f"Sent to {email}")
            except ClientError as e:
                print(f"Error sending email to {email} with content:")
                print(content)
                raise e

        print("Sent batch: ", batch)

    return "Successfully sent messages"

verify_template = {"subject": "Sign In to Bear Loves Rocks",
                  "body": "<html>\
                             <head>\
                               <style>\
                                 body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }\
                                 .content { max-width: 600px; margin: 0 auto; }\
                                 .timestamp { font-size: 7pt; color: #999; margin-top: 15px; text-align: right; }\
                               </style>\
                             </head>\
                             <body>\
                               <div class='content'>\
                                 <div class='timestamp'>{{timestamp}}</div>\
                                 <p>Hi {{name}},</p>\
                                 <p>Click <a href='{{verify_url}}'>HERE</a> to sign in to Bear Loves Rocks.</p>\
                                 <p>From,<br>The BLR Security Team</p>\
                                 <div class='timestamp'>{{timestamp}}</div>\
                               </div>\
                             </body>\
                           </html>"}

templates = {"verify": verify_template}

