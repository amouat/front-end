FROM node:6.5-slim  

RUN groupadd -r frontend && useradd -r -g frontend frontend

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
#Copy package.json first to avoid rebuilding on code changes
COPY package.json /usr/src/app
RUN npm install

#Now copy the rest of the code
COPY . ./

USER frontend

ENV MODE "production"
ENV PORT 8079
EXPOSE 8079

# Start the app
CMD ["./cmd.sh"]
