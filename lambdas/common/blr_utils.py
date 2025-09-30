import os
import json
import boto3
from botocore.exceptions import ClientError

s3 = boto3.client("s3")
ssm = boto3.client("ssm")
cognito = boto3.client("cognito-idp")
sns = boto3.client("sns")

def key_exists_s3(bucket, key):
    try:
        s3.head_object(Bucket=bucket, Key=key)
        return True
    except ClientError as e:
        return False


def read_file_s3(bucket, key):
    try:
        data_s3 = s3.get_object(Bucket=bucket, Key=key)
    except ClientError as e:
        return None

    return json.loads(data_s3["Body"].read().decode("utf-8"))


def write_file_s3(bucket, key, data):
    response = s3.put_object(Body=bytes(json.dumps(data).encode("utf-8")), Bucket=bucket, Key=key)
    return None


def delete_file_s3(bucket, key):
    response = s3.delete_object(Bucket=bucket, Key=key)
    return None

def read_parameter_ssm(name):
    try:
        return ssm.get_parameter(Name=name)["Parameter"]["Value"]
    except ClientError as e:
        return None


def get_user_cognito(access_token):
    try:
        return cognito.get_user(AccessToken=access_token)
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == 'NotAuthorizedException':
            return None  # or raise a custom exception
        else:
            raise e  # Re-raise other errors

def get_user_attribute_cognito(access_token, attribute):
    user = get_user_cognito(access_token)
    if user is None:  # Handle invalid token case
        return None
    
    # Handle single attribute case
    if isinstance(attribute, str):
        for attr in user['UserAttributes']:
            if attr['Name'] == attribute:
                return attr['Value']
        return None
    
    # Handle multiple attributes case
    if isinstance(attribute, (list, tuple)):
        attr_values = [None] * len(attribute)
        for i, attr_name in enumerate(attribute):
            for attr in user['UserAttributes']:
                if attr['Name'] == attr_name:
                    attr_values[i] = attr['Value']
                    break
        return tuple(attr_values)
    
    return None

def trigger_email_sns(email_topic_arn, emailbatch):
    # emailbatch: {"typ": t , "content": {}, "recipients": [pname1, pname2,...]}
    msg = json.dumps(emailbatch)

    try:
        response = sns.publish(TopicArn=email_topic_arn, Message=msg)
    except ClientError as e:
        print(f"Error sending email batch: {msg}")
        raise e