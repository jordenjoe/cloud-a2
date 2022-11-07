import boto3
import base64
import json

import requests
from requests_aws4auth import AWS4Auth

s3 = boto3.client('s3')

REGION = 'us-east-1'
SERVICE = 'es'
CREDENTIALS = boto3.Session().get_credentials()
AWSAUTH = AWS4Auth(CREDENTIALS.access_key, CREDENTIALS.secret_key, REGION, SERVICE, session_token=CREDENTIALS.token)

HOST = 'https://search-photos-wwyb2fbtpbgr52ygjjbjtky56a.us-east-1.es.amazonaws.com'
INDEX = 'photos'
TYPE = '_doc'
URL = HOST + '/' + INDEX + '/' + TYPE
URL_SEARCH = HOST + '/' + INDEX + '/' + '_search'

HEADERS = { "Content-Type": "application/json" }

def indexOpenSearch(document):
    r = requests.post(URL, auth=AWSAUTH, data=json.dumps(document), headers=HEADERS)
    return r

def opensearchQuery(keywords):
    queryString = ''
    for i, keyword in enumerate(keywords):
        queryString += keyword
        if i < len(keywords) - 1:
            queryString += ' OR '

    query = {
        "query": {
            "multi_match": {
                "query": queryString
            }
        }
    }
    
    r = requests.get(URL_SEARCH, auth=AWSAUTH, headers=HEADERS, data=json.dumps(query))

    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": '*'
        },
        "isBase64Encoded": False
    }

    response['body'] = r.text
    return response

def disambiguateQuery(event):
    
    client = boto3.client('lexv2-runtime')
    
    query = event["queryStringParameters"]['q']
    
    #Initiate conversation with Lex
    #Update botId, botAlisId and sessionId
    response = client.recognize_text(botId='01TR2H6OF3',
                                 botAliasId='YVOGKOCGK0',
                                 localeId='en_US',
                                 sessionId='testuser',
                                 text=query)

    print('response: ', response)
    
    query = []

    if response["interpretations"][0]["intent"]["slots"]["Thing"]:
        query.append(response["interpretations"][0]["intent"]["slots"]["Thing"]["value"]["interpretedValue"])
    
    if response["interpretations"][0]["intent"]["slots"]["Thing2"]:
        query.append(response["interpretations"][0]["intent"]["slots"]["Thing2"]["value"]["interpretedValue"])
    
    return query

def getBody(imageObjects):
    html = ""
    
    for object in imageObjects:
        print('object: ', object)
        html += "<img class='photo' src='https://bucketb2.s3.amazonaws.com/" 
        html += object
        html += "'/>"
        
    return html
        

# Lambda execution starts here
def lambda_handler(event, context):
    try:
         
        ##### USE LEX TO DISAMBIGUATE THE QUERY #####
    
        query = disambiguateQuery(event)
    
        ##### QUERY ELASTIC SEARCH #####
        
        response = opensearchQuery(query)
        hits = json.loads(response['body'])
        
        #making this into a set to avoid duplicates
        objectKeys = set()
        
        for hit in hits['hits']['hits']:
            objectKey = hit['_source']['objectKey']        
            objectKeys.add(objectKey)
            
        print('objectKeys:', objectKeys)
        
        ### CREATE HTML ###
        
        html = getBody(objectKeys)
    
        ##### RETURN THE IMAGES AS PRE-BUILT HTML #####
        
        if len(html) > 0:
            return {
                'headers': { "Content-type": "text/html", "Access-Control-Allow-Origin":"*"},
                'statusCode': 200,
                'body': html,
            }

        else:
            return {
                'headers': { "Content-type": "text/html", "Access-Control-Allow-Origin":"*"},
                'statusCode': 200,
                'body': "<h1>Sorry, no photos found for this request.</h1>",
            }

    except:
        
        return {
            'headers': { "Content-type": "text/html", "Access-Control-Allow-Origin":"*"},
            'statusCode': 200,
            'body': "<h1>Sorry, no photos found for this request.</h1>",
        }

   