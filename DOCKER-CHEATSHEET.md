# Docker Cheatsheet for Team Track Project

## Basic Container Operations

### Start/Stop Services

```bash
# Start all services (detached mode)
docker compose -f docker-compose-dev.yml up -d

# Start with rebuild (force new build)
docker compose -f docker-compose-dev.yml up --build -d

# Stop all services
docker compose -f docker-compose-dev.yml down

# Stop and remove everything (containers, networks, images)
docker compose -f docker-compose-dev.yml down --rmi all --volumes --remove-orphans
```

### Restart Services

```bash
# Restart all services (keeps same containers)
docker compose -f docker-compose-dev.yml restart

# Restart specific service
docker compose -f docker-compose-dev.yml restart app

# Stop and start fresh (recommended for updates)
docker compose -f docker-compose-dev.yml down
docker compose -f docker-compose-dev.yml up -d
```

## Image Management

### Pull/Push Images

```bash
# Pull latest images from registry
docker compose -f docker-compose-dev.yml pull

# Pull specific image
docker pull ghcr.io/your-gh-username/team-track:dev-latest

# Pull without cache (force fresh download)
docker pull --no-cache ghcr.io/your-gh-username/team-track:dev-latest

# List all images
docker images

# List specific images
docker images | grep team-track
```

### Remove Images

```bash
# Remove specific image
docker rmi ghcr.io/your-gh-username/team-track:dev-latest

# Remove image by ID
docker rmi 3ee5ca58b521

# Remove multiple images
docker rmi $(docker images -q ghcr.io/your-gh-username/team-track)

# Remove unused images
docker image prune -f

# Remove all unused images (aggressive)
docker image prune -a -f
```

## Container Management

### View Containers

```bash
# List running containers
docker compose -f docker-compose-dev.yml ps

# List all containers (running and stopped)
docker ps -a

# Show container resource usage
docker stats
```

### Container Logs

```bash
# View logs for specific service
docker compose -f docker-compose-dev.yml logs app

# Follow logs in real-time
docker compose -f docker-compose-dev.yml logs -f app

# View last 50 lines
docker logs teamtrack-dev-app-1 --tail=50

# View logs with timestamps
docker logs teamtrack-dev-app-1 --timestamps
```

### Execute Commands in Containers

```bash
# Open bash shell in running container
docker compose -f docker-compose-dev.yml exec app bash

# Run single command
docker compose -f docker-compose-dev.yml exec app ls -la /app/public/media

# Run command in new container (if service is down)
docker run --rm -it ghcr.io/your-gh-username/team-track:dev-latest bash
```

## Volume Management

### List Volumes

```bash
# List all volumes
docker volume ls

# List project-specific volumes
docker volume ls | grep team-track
```

### Volume Operations

```bash
# Remove specific volume
docker volume rm teamtrack-dev_teamtrack_media

# Remove unused volumes
docker volume prune -f

# Inspect volume (see where it's stored)
docker volume inspect teamtrack-dev_teamtrack_media

# Backup volume to tar file
docker run --rm -v teamtrack-dev_teamtrack_media:/data -v $(pwd):/backup alpine tar czf /backup/media-backup.tar.gz -C /data .

# Restore volume from tar file
docker run --rm -v teamtrack-dev_teamtrack_media:/data -v $(pwd):/backup alpine tar xzf /backup/media-backup.tar.gz -C /data
```

## System Cleanup

### Clean Up Commands

```bash
# Remove unused containers, networks, images
docker system prune -f

# Aggressive cleanup (removes everything not in use)
docker system prune -a -f --volumes

# Clean up specific to team-track (keep only latest 3 images)
docker images ghcr.io/your-gh-username/team-track --format "table {{.Repository}}:{{.Tag}}\t{{.ID}}" | grep -v latest | tail -n +4 | awk '{print $2}' | xargs -r docker rmi
```

### Check System Usage

```bash
# Show disk usage by Docker
docker system df

# Show detailed usage
docker system df -v
```

## Build Operations

### Build Images

```bash
# Build image locally
docker build -t ghcr.io/your-gh-username/team-track:dev-latest .

# Build without cache (fresh build)
docker build --no-cache -t ghcr.io/your-gh-username/team-track:dev-latest .

# Build with docker-compose
docker compose -f docker-compose-dev.yml build

# Build specific service
docker compose -f docker-compose-dev.yml build app
```

## Debugging & Troubleshooting

### Common Issues

```bash
# Check if containers are healthy
docker compose -f docker-compose-dev.yml ps

# View container health logs
docker inspect teamtrack-dev-app-1 | grep -A10 Health

# Check resource usage
docker stats --no-stream

# Check network connectivity
docker compose -f docker-compose-dev.yml exec app ping db
```

### Network Operations

```bash
# List networks
docker network ls

# Inspect network
docker network inspect teamtrack-dev_default

# Connect container to network
docker network connect teamtrack-dev_default container_name
```

## File Operations

### Copy Files To/From Containers

```bash
# Copy file from container to host
docker cp teamtrack-dev-app-1:/app/some-file.txt ./local-file.txt

# Copy file from host to container
docker cp ./local-file.txt teamtrack-dev-app-1:/app/some-file.txt

# Copy entire directory
docker cp teamtrack-dev-app-1:/app/public/media/ ./media-backup/
```

### Volume File Operations

```bash
# List files in volume
docker run --rm -v teamtrack-dev_teamtrack_media:/data alpine ls -la /data

# Create file in volume
docker run --rm -v teamtrack-dev_teamtrack_media:/data alpine touch /data/test-file.txt

# View file content in volume
docker run --rm -v teamtrack-dev_teamtrack_media:/data alpine cat /data/some-file.txt
```

## Project-Specific Commands

### Team Track Deployment Workflow

```bash
# Complete deployment with fresh images
docker compose -f docker-compose-dev.yml down
docker volume rm teamtrack-dev_teamtrack_nextcache  # Remove Next.js cache
docker compose -f docker-compose-dev.yml pull
docker compose -f docker-compose-dev.yml up -d

# Check deployment success
docker compose -f docker-compose-dev.yml logs -f app
curl -I https://dev.teamtrack.example.com
```

### Database Operations

```bash
# Connect to PostgreSQL database
docker compose -f docker-compose-dev.yml exec db psql -U $POSTGRES_USER -d $POSTGRES_DB

# Backup database
docker compose -f docker-compose-dev.yml exec db pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup.sql

# Restore database
docker compose -f docker-compose-dev.yml exec -T db psql -U $POSTGRES_USER -d $POSTGRES_DB < backup.sql
```

### Run Payload Commands

```bash
# Run migrations
docker compose -f docker-compose-dev.yml exec app pnpm payload migrate

# Check migration status
docker compose -f docker-compose-dev.yml exec app pnpm payload migrate:status

# Generate types
docker compose -f docker-compose-dev.yml exec app pnpm payload generate:types
```

## Quick Reference

### Emergency Recovery

```bash
# If everything is broken, nuclear reset:
docker compose -f docker-compose-dev.yml down --rmi all --volumes --remove-orphans
docker system prune -a -f --volumes
docker compose -f docker-compose-dev.yml up --build -d
```

### Check What's Running

```bash
# Quick health check
docker compose -f docker-compose-dev.yml ps
docker compose -f docker-compose-dev.yml logs --tail=10 app
curl -I https://dev.teamtrack.example.com
```

### Force Fresh Deployment

```bash
# When you need to ensure absolutely fresh deployment
docker compose -f docker-compose-dev.yml down
docker rmi $(docker images -q ghcr.io/your-gh-username/team-track)
docker volume rm teamtrack-dev_teamtrack_nextcache  # Keep media volume!
docker compose -f docker-compose-dev.yml pull
docker compose -f docker-compose-dev.yml up -d
```

---

## Important Notes

- **Always use `-f docker-compose-dev.yml`** for your dev environment
- **Keep `teamtrack_media` volume** - it contains your uploaded media files
- **Remove `teamtrack_nextcache` volume** when you want fresh deployments
- **Use `-d` flag** to run containers in background (detached mode)
- **Check logs** after any deployment to ensure everything is working
- **Use `--no-cache`** when you want to bypass Docker's build/pull cache

## File Locations

- **Docker Compose**: `/srv/teamtrack-dev/docker-compose-dev.yml`
- **Media Volume**: `teamtrack-dev_teamtrack_media` (Docker managed)
- **Database Volume**: `teamtrack-dev_teamtrack_pgdata` (Docker managed)
- **Container Media Path**: `/app/public/media/`
- **Local Media Path**: `./public/media/` (mostly empty, gitignored)
