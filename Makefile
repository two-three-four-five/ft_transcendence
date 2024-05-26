all: up

re: clean all

up:
	docker compose --file docker-compose.yaml up --build -d

down:
	docker compose --file docker-compose.yaml down

start:
	docker compose --file docker-compose.yaml start

stop:
	docker compose --file docker-compose.yaml stop

clean:
	docker compose -f docker-compose.yaml down
	docker volume rm -f reflected_db