run_locally:
	$(MAKE) build_images
	docker-compose up -d
	docker-compose ps

build_images:
	ARCH=amd64 docker-compose -f docker-compose.build.yaml build
	ARCH=armhf docker-compose -f docker-compose.build.yaml build
	ARCH=armv7 docker-compose -f docker-compose.build.yaml build
	ARCH=aarch64 docker-compose -f docker-compose.build.yaml build
	ARCH=i386 docker-compose -f docker-compose.build.yaml build

push_images:
	ARCH=amd64 docker-compose -f docker-compose.build.yaml push
	ARCH=armhf docker-compose -f docker-compose.build.yaml 
	
	ARCH=armv7 docker-compose -f docker-compose.build.yaml build
	ARCH=aarch64 docker-compose -f docker-compose.build.yaml build
	ARCH=i386 docker-compose -f docker-compose.build.yaml build

