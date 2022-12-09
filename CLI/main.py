import requests
import argparse
import os
import shutil

width = shutil.get_terminal_size().columns

ip = "localhost"
port = 5000

def list(server_ip, port):
    response = requests.get(f"http://127.0.0.1:5000/list").json()

    for i in response:
        print("-" * width)
        print(f"\nTitle: '{i['title']}'")
        print(f"\n> {i['content']}\n")
        print("-" * width)


# create a new ArgumentParser object
parser = argparse.ArgumentParser()

# add a new standalone switch
parser.add_argument("-l", "--list", action="store_true", help="list notes")

# parse the command line arguments
args = parser.parse_args()

# check if the verbose switch is set
if args.list:
    list(ip, port)
else:
    print("Verbose mode disabled")
