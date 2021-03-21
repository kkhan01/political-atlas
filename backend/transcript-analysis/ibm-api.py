import json
import sys
from ibm_watson import ToneAnalyzerV3
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

sys.path.append("../di")
import db

sys.path.append("../speech_scraper")
import scrape

with open('config.json') as f:
    json_string = json.load(f)

ibmkey = json_string['API_Key']

# Api Access
# Using latest version 2017-09-21
authenticator = IAMAuthenticator(
    ibmkey)
tone_analyzer = ToneAnalyzerV3(
    version='2017-09-21',
    authenticator=authenticator
)
# url corresponds to location closest
tone_analyzer.set_service_url(
    'https://api.us-east.tone-analyzer.watson.cloud.ibm.com/instances/02ad5ad4-e149-4347-a67e-b94550f58e84')


# return jsonfile of text
def text_to_analyze(text):
    dump = []
    repeat = True
    while repeat:
        # json file from api
        tone_analysis = tone_analyzer.tone(
            {'text': text},
            content_type='application/json'
        ).get_result()     
        dump.append(tone_analysis)
        last = tone_analysis['sentences_tone'][-1]
        if last['sentence_id'] == 99:
            sentence = last['text']
            text = text[text.find(sentence)+len(sentence):].strip()
        else:
            repeat = False
        
    ret = dump[0]
    for response in dump[1:]:
        ret['sentences_tone'] += response['sentences_tone']

    #print(json.dumps(ret,indent=2))

    return ret

# prints the tone score for the entire document
# scores range from 0.5-1.0
# scores under 0.0 will result in empty array
# scores above .75 are high accuracy


def tone_of_document(text):
    document_tone = "Document Tone\n"
    for elements in text_to_analyze(text)["document_tone"]["tones"]:
        document_tone += "Tone Name: " + str(elements["tone_name"]) + "\n"
        if not elements:
            document_tone += "High confidence? : Not Enough Data\n"
        else:
            document_tone += "Score: " + \
                str(elements["score"]) + "Percent: " + \
                str("{0:.0%}".format(elements["score"])) + "\n"

            if(elements["score"] > 0.75):
                document_tone += "High confidence? : Yes\n"
            else:
                document_tone += "High confidence? : No\n"
    return document_tone

# prints the tone score for each setence in the document
# scores range from 0.5-1.0
# scores under 0.0 will result in empty array
# scores above .75 are high accuracy
def tone_of_sentences(text):
    sentence_tone = "Sentence Tones\n"
    #iterate thorugh each setence dictinary and displays the sentence number and text
    for index, elements in enumerate(text_to_analyze(text)["sentences_tone"], start=1):
        sentence_tone += f"Sentence Number: {index}\n"
        sentence_tone += "Sentence: " + elements["text"] + "\n"
        if not elements["tones"]:
            sentence_tone += "High confidence? : Not Enough Data\n"
        else:
            #if there are tones, reads through each tone dictionary and displays tone name/score
            for tones in elements["tones"]:
                sentence_tone += "Tone Name: " + tones["tone_name"] + "\n"
                sentence_tone += "Score: " + \
                    str(tones["score"]) + " Percent: " + \
                    str("{0:.0%}".format(tones["score"])) + "\n"
                if(tones["score"] > 0.75):
                    sentence_tone += "High confidence? : Yes\n"
                else:
                    sentence_tone += "High confidence? : No\n"
        sentence_tone += "\n"
    return sentence_tone


if __name__ == '__main__':
    for i in db.get_scrape():
        text = i['transcript']
        print(tone_of_sentences(text))
        break
    
    # text = scrape.millerscrape()[0]['transcript']
    # print(tone_of_sentences(text))
    # for speeches in db.get_scrape():
    #     text = speeches['transcript']
    #     print(tone_of_document(text)
    #     print(tone_of_sentences(text)
