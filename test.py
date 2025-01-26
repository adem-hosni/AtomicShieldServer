from locust import HttpUser, TaskSet, between, task


def index(l):
    l.client.get("/")

def signin(l):
    l.client.get("/auth/signin")

def signup(l):
    l.client.get("/auth/signup")



class UserTasks(TaskSet):
    @task
    def isconnected(l):
        l.client.post("/anticheat/status/isconnected")
    
    @task
    def agent_status(l):
        l.client.post("/anticheat/status/agent")
    
    @task
    def status_version(l):
        l.client.post("/anticheat/status/version", {"version": "1.0-b"})
    
    # @task
    # def download_engine(l):
    #     l.client.post("/resources/scan/fivem")

class WebsiteUser(HttpUser):
    """
    User class that does requests to the locust web server running on localhost
    """

    host = "http://127.0.0.1:8089"
    wait_time = between(1, 3)
    tasks = [UserTasks]
