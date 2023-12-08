FROM python:3.11-alpine3.17
COPY . /usr/src/backend
WORKDIR /usr/src/backend
RUN pip install -r requirements.txt
EXPOSE 5000
CMD ["python", "run.py"] 
