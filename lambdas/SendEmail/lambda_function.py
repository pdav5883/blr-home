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
        template = batch["template"]
        content = batch["content"]
            
        for name, email in zip(batch["recipient_names"], batch["recipient_emails"]):
            content["name"] = name.split(" ")[0] # first name only
            # Add timestamp to content
            content["timestamp"] = datetime.now(UTC).strftime("%Y-%m-%d %H:%M:%S UTC")

            subject = template["subject"]
            body = template["body"]

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
