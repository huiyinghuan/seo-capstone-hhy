# Use official Python image
FROM python:3.13

# Set the working directory in the container
WORKDIR /app

# Copy only requirements.txt first to leverage Docker caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project
COPY . .

# Expose the Django port
EXPOSE 8000

# Set environment variables for Django
ENV PYTHONUNBUFFERED=1

# Start Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
