import requests
from bs4 import BeautifulSoup
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

path = "C:\\Users\crisc\Desktop\VSC\Firebase App\creds\webscrapper2023-9608e-firebase-adminsdk-ljq71-d0ea6b7acb.json"
cred = credentials.Certificate(path)
firebase_admin.initialize_app(cred, {'databaseURL':'https://webscrapper2023-9608e-default-rtdb.europe-west1.firebasedatabase.app/'})

def download_event_details (url):
    response = requests.get(url)
    soup = response.text
    soup = BeautifulSoup(soup,"lxml")
    
    return soup

def extract_description (soup):
    container = soup.find(id="venuesList3")
    p_tags = container.find_all('p', recursive=True)
    # Accessing the second <p> tag, index [1] because list indices start at 0
    if len(p_tags) > 1:
        target_element = p_tags[2]
        # to do: fix p_tags[1 or 2]
        # if tags 1 is empty, go to 2
    return target_element.text

def extract_event_details (soup):
    #event_title = soup.title.text.strip()
    event_title = soup.find("p", {"class":"h3 h"}).text.strip()
    eventPrice = soup.find("p", {"class":"h4 h"}).text.strip()
    eventPrice = eventPrice[:15]
    eventAge = soup.find("small", {"class":"minAge"}).text.strip()
    #venue-1016908 > div > div > p.h4.h > span > small:nth-child(1)
    eventDistance = soup.find("p", {"class": "distance"}).text.strip()
    #//*[@id="venue-1016908"]/div/div/p[2]/text()
    eventLink = soup.find("a", {"class": "venueLink"}).text.strip()
    ##venue-1016908 > div > div > p.button > a
    event_image = soup.find("img", {"class": "img lazy"})
    ##venue-1016908 > div > span
    
    event_details = {
        "title": event_title,
        "price": eventPrice,
        "age": eventAge,
        "distance": eventDistance,
        "link": eventLink,
        "image": event_image
    }

    return event_details

def get_id_from_url(url):
    url_parts = url.split("/")
    id = url_parts[-1]
    return id

def save_event_details_to_json (event_details):
    event_details_json = "event_details.json"
    with open(event_details_json, "w", encoding="utf-8") as json_file:
        json.dump(event_details, json_file, indent=2)

def save_event_details_to_firebase(event_details, id):
    print(event_details)
    print(id)
    try:
        # Reference to the database
        ref = db.reference('events')
        # Pushing the new event details
        ref.child(id).set(event_details)
    except Exception as e:
        print(e)

events = [
    "https://theactivitypeople.co.uk/en/venues/adrenalin-activities/bristol/oTown-6314"
]

if __name__ == "__main__":
    for url in events:
        id = get_id_from_url(url)
        soup = download_event_details(url)
        event_details = extract_event_details(soup)
        save_event_details_to_firebase(event_details, id)