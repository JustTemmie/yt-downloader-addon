# start by pulling the python image
FROM python:3.8-alpine

# copy the requirements file into the image
COPY ./requirements.txt /app/requirements.txt

# switch working directory
WORKDIR /app

# make tmp 
RUN mkdir temp/

# install the dependencies and packages in the requirements file
RUN pip install -r requirements.txt

# copy the files over
COPY . .

CMD [ "python", "main.py" ]