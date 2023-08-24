ARG APP=rlm
ARG DIR=/go/src

FROM golang:1.18 AS builder

ARG APP
ARG DIR

COPY . ${DIR}/

WORKDIR ${DIR}/

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -mod vendor -o bin/${APP} cmd/main.go

FROM golang:1.18

ARG APP
ARG DIR

COPY --from=builder ${DIR}/bin/${APP} /app/

WORKDIR /app

EXPOSE 8100

CMD ["/app/rlm"]

