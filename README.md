# Burger Queen - API con Node.js

## Índice

* [1. Preámbulo](#1-pre%C3%A1mbulo)
* [2. Resumen del proyecto](#2-resumen-del-proyecto)
* [3. Objetivos de aprendizaje](#3-objetivos-de-aprendizaje)
* [4. Consideraciones generales](#4-consideraciones-generales)
* [4. Criterios de aceptación mínimos del proyecto](#4-criterios-de-aceptaci%C3%B3n-m%C3%ADnimos-del-proyecto)
* [6. Pistas, tips y lecturas complementarias](#6-pistas-tips-y-lecturas-complementarias)
* [7 HTTP API Checklist](#7-http-api-checklist)

## 1. Preámbulo

Un pequeño restaurante de hamburguesas, que está creciendo, necesita un
sistema a través del cual puedan tomar pedidos usando una _tablet_, y enviarlos
a la cocina para que se preparen ordenada y eficientemente.

Este proyecto tiene dos áreas: interfaz web (cliente) y API (servidor). Nuestra
clienta nos ha solicitado desarrollar la API que se debe integra con la
interfaz, que otro equipo de desarrolladoras está trabajando simultáneamente.

## 2. Resumen del proyecto

En este proyecto creamos una API a través de la cual podemos enviarle _consultas_ (_request_) y obtener _respuestas_ (_response_) usando el protocolo HTTP (o HTTPS).

La clienta nos ha dado un [link a la documentación](https://laboratoria.github.io/burger-queen-api/)
que especifica el comportamiento esperado de la API que expondremos por HTTP.
En este proyecto se construyo un servidor web que debe mostrar JSON sobre HTTP, y desplegarlo en un servidor en la nube.

Para este proyecto se hizo uso de **Node.js** como herramienta para desarrollar _aplicaciones de servidor_, junto con una serie de herramientas comunes usadas en este tipo de contexto (Express como framework, MongoDB como base datos, contenedores de docker,etc).

## 3. Consideraciones generales

Este proyecto se integro con el proyecto front-end [Burger Queen API client](../04-burger-queen-api-client), vasado en una aplicacion destinada a restaurantes.

Otro requerimiento del equipo de QA de nuestra clienta es realizar
**pruebas _end-to-end_**, que usaremos para verificar el comportamiento desde el
punto de vista de HTTP, desde afuera del servidor. Estos tests, a diferencia de
las pruebas unitarias, no prueban cada pieza por separado sino que prueban la
aplicación completa, de principio a fin.

Se ejecuto todos los tests _end-to-end_ con el comando `npm run test:e2e`, logrando pasar el 100% de las pruebas.

![test e2e users](https://user-images.githubusercontent.com/74318016/131880478-edc3c840-00cf-4b0b-8f94-9c1bcd8916a8.PNG)

![test e2e orders](https://user-images.githubusercontent.com/74318016/131880762-8a232d4f-2374-4823-8113-d1a2816ee481.PNG)

![test e2e products and auth](https://user-images.githubusercontent.com/74318016/131880814-de84ca3c-96fa-4440-9c7a-e0204fe37f14.PNG)


## 4. Criterios de aceptación mínimos del proyecto

### 4.1 API

Según lo establecido por la [documentación](https://laboratoria.github.io/burger-queen-api/)
entregada por nuestra clienta, la API debe exponer los siguientes endpoints:

#### 4.1.1 `/`

* `GET /`

      Request:
      https://burguer-api-2021.herokuapp.com/

      Reponse:
      {
          "name": "burger-queen-api",
          "version": "1.0.0"
      }

#### 4.1.2 `/auth`

* `POST /auth`

      Request:
      https://burguer-api-2021.herokuapp.com/auth

      Body:
      { 
        "email": "admin@localhost.com",
        "password": "changeme"
      }   

      Response:
      {
        "token": "eyJhbGciOiJIUzI1NiIsInR4cCI6IkpXVCJ9.eyJ1aWQiOiI2MTJmYTlmMDI0ZjA3ZTAwMTZmM2Q1NTAiLCJlbWFpbCI6ImFkbWludHdvQGxvY2FsaG9zdCIsInJvbGVzIjp7ImFkbWluIjp0cnVlfSwiaWF0IjoxNjMwNjAwMzk3LCJleHAiOjE2MzE4MDk4OTd9.46-rnfWS4U6qy4xhLPyuHqKkBdhZjEEpOZgVYwuJ8xM"
      }


#### 4.1.3 `/users`

* `GET /users`

      Request:
      https://burguer-api-2021.herokuapp.com/users

      Response:
      {
        "roles": {
        "admin": true
        },
        "_id": "612fa7f3ab04d34e2446cc18",
        "email": "admin@localhost",
        "password": "$2b$10$6JwhYuhjGZcKK.ssOgq08.6E6NN8XLaECm3SqKQU0.bOwGRKlXWEy"
      },

* `GET /users/:uid`

      Request:
      https://burguer-api-2021.herokuapp.com/users/6130ec0a83944d00169b0d9e

      Response:
      {
        "roles": {
        "admin": false
        },
        "_id": "6130ec0a83944d00169b0d9e",
        "email": "nangebav@gmail.com",
        "password": "$2b$10$XtTFV6d6orUs/f2MFfUwYuK./zb399B3h1epxwYrsI3ZmTkJzCDQG"
      }

* `POST /users`

      Request:
      https://burguer-api-2021.herokuapp.com/users

      Body:
      {
        "roles": {
        "admin": true
        },
        "_id": "612fa7f3ab04d34e2446cc18",
        "email": "adminTwo@localhost",
        "password": "holis"
      }

      Response:
      {
        "_id": "6130ffe34b1e490016af212e",
        "email": "adminTwo@localhost",
        "roles": {
        "admin": true
        }
      }

* `PUT /users/:uid`

      Request:
      https://burguer-api-2021.herokuapp.com/users/6130ffe34b1e490016af212e

      Body: 
      {
        "roles": {
        "admin": true
      },
        "email": "adminTwo@localhost",
        "password": "hola"
      }
          
      Response:
      {
        "user": {
          "roles": {
          "admin": true
          },
          "_id": "6130ffe34b1e490016af212e",
          "email": "adminTwo@localhost",
          "password": "$2b$10$QG.OV2dExBVeQ6/Nw84Gi..U4zNoqbyxDFWnBYLdCm1PUACPtkxS6"
        }
     }

* `DELETE /users/:uid`

      Request:
      https://burguer-api-2021.herokuapp.com/users/6130ffe34b1e490016af212e

      Response: 
      {
        "message": "se eliminó el usuario"
      }

#### 4.1.4 `/products`

* `GET /products`

      Request: 
      https://burguer-api-2021.herokuapp.com/products

      Response: 
      [
        {
          "image": "https://therockstore.com.ar/wp-content/uploads/2021/06/noImg-24.png",
          "type": "side dishes",
          "dateEntry": "2021-09-02T14:01:44.007Z",
          "_id": "6130d9c061a98e0016e6c7b1",
          "name": "quesadillas",
          "price": 10
        },
        {
          "image": "https://therockstore.com.ar/wp-content/uploads/2021/06/noImg-24.png",
          "type": "burger",
          "dateEntry": "2021-09-02T14:01:44.007Z",
          "_id": "6130da1461a98e0016e6cf01",
          "name": "Palitos de queso",
          "price": 4
        } 
      ]

* `GET /products/:productid`

      Request:
      https://burguer-api-2021.herokuapp.com/products/6130da7361a98e0016e6d77a

      Response: 
      {
        "image": "https://therockstore.com.ar/wp-content/uploads/2021/06/noImg-24.png",
        "type": "sandwich",
        "dateEntry": "2021-09-02T14:01:44.007Z",
        "_id": "6130da7361a98e0016e6d77a",
        "name": "tacos",
        "price": 12
      }

* `POST /products`

      Request:
      https://burguer-api-2021.herokuapp.com/products

      Body:
      { 
        "name": "haburguesa con pollo",
        "price": 10
      }

      Response:
      { 
        "name": "haburguesa con pollo",
        "price": 10
      }

* `PUT /products/:productid`

      Request:
      https://burguer-api-2021.herokuapp.com/products/6131044e4b1e490016af336b

      body: 
      { 
        "name": "haburguesa de pollo",
        "price": 10
      }

      Response: 
      {
        "image": "https://therockstore.com.ar/wp-content/uploads/2021/06/noImg-24.png",
        "type": "burger",
        "dateEntry": "2021-09-02T14:43:08.494Z",
        "_id": "6131044e4b1e490016af336b",
        "name": "haburguesa de pollo",
        "price": 10
      }

* `DELETE /products/:productid`

      Request:
      https://burguer-api-2021.herokuapp.com/products/6131044e4b1e490016af336b

      Response:
      {
        "message": "se eliminó el producto"
      }

#### 4.1.5 `/orders`

* `GET /orders`

      Request:
      https://burguer-api-2021.herokuapp.com/orders

      Response:
      [
        {
          "status": "delivered",
          "dateEntry": "2021-09-02T14:43:08.499Z",
          "_id": "6130f2ec4b1e490016af0c41",
          "products": [
              {
                "qty": 1,
                "product": "6130da1461a98e0016e6cf01"
              },
              {
                "qty": 2,
                "product": "6130da1461a98e0016e6cf01"
              },
              {
                "qty": 2,
                "product": "6130da1461a98e0016e6cf01"
              }
          ],
              "userId": "M11",
              "client": "nathy",
              "dateProcessed": "2021-09-02T14:44:46.203Z"
        },
        {
          "status": "pending",
          "dateEntry": "2021-09-02T14:43:08.499Z",
          "_id": "613106d44b1e490016af4b27",
          "products": [
              {
                "qty": 1,
                "product": "6130da1461a98e0016e6cf01"
              }
          ],
          "userId": "M11",
          "client": "nathy"
        }
      ]

* `GET /orders/:orderId`

      Request:
      https://burguer-api-2021.herokuapp.com/orders/6131072b4b1e490016af40a7

      Response:
      {
          "status": "pending",
          "dateEntry": "2021-09-02T14:43:08.499Z",
          "_id": "6131072b4b1e490016af40a7",
          "products": [
           {
            "qty": 1,
            "product": {
            "image": "https://therockstore.com.ar/wp-content/uploads/2021/06/noImg-24.png",
            "type": "burger",
            "dateEntry": "2021-09-02T14:01:44.007Z",
            "_id": "6130da1461a98e0016e6cf01",
            "name": "Palitos de queso",
            "price": 4
            }
           }
          ],
          "userId": "M11",
          "client": "nathy"
      }

* `POST /orders`

      Request: 
      https://burguer-api-2021.herokuapp.com/orders/

      Body: 
      {
        "status": "delivered",
        "dateEntry": "2021-09-02T14:43:08.499Z",
        "_id": "6130f2ec4b1e490016af0c41",
        "products": [
          {
          "qty": 1,
          "product": "6130da1461a98e0016e6cf01"
          }
        ],
        "userId": "M11",
        "client": "nathy",
        "dateProcessed": "2021-09-02T14:44:46.203Z"
      }

      Response: 
      {
        "status": "pending",
        "dateEntry": "2021-09-02T14:43:08.499Z",
        "_id": "613108044b1e490016af4e8d",
        "products": [
          {
            "qty": 1
          }
        ],
        "userId": "M11",
        "client": "nathy"
      }

* `PUT /orders/:orderId`

      Request: 
      https://burguer-api-2021.herokuapp.com/orders/613106d44b1e490016af4b27

      Body: 
      {
        "status": "delivered",
        "userId": "M11",
        "client": "nathy"
      }

      Response:  
      {
        "status": "delivered",
        "dateEntry": "2021-09-02T14:43:08.499Z",
        "_id": "613106d44b1e490016af4b27",
        "products": [
          {
            "qty": 1,
            "product": "6130da1461a98e0016e6cf01"
          }
        ],
        "userId": "M11",
        "client": "nathy",
        "dateProcessed": "2021-09-02T17:23:33.724Z"
      }

* `DELETE /orders/:orderId`

      Request: 
      https://burguer-api-2021.herokuapp.com/orders/613106d44b1e490016af4b27

      Response: 
      {
        "message": "se eliminó la orden"
      }

## 5. Variables de entorno

Nuestra aplicación usa las siguientes variables de entorno:

* `PORT`: Si no se ha especificado un puerto como argumento de lína de comando,
  podemos usar la variable de entorno `PORT` para especificar el puerto. Valor
  por defecto `8080`.
* `DB_URL`: El _string_ de conexión de _MongoDB_ o _MySQL_. Cuando ejecutemos la
  aplicación en nuestra computadora (en entorno de desarrollo), podemos usar el
  una base de datos local, pero en producción deberemos utilizar las instancias
  configuradas con `docker-compose` (mas sobre esto en la siguiente sección de
  **Deployment**)
* `JWT_SECRET`: Nuestra aplicación implementa autenticación usando JWT (JSON
  Web Tokens). Para poder firmar (cifrar) y verificar (descifrar) los tokens,
  nuestra aplicación necesita un secreto. En local puedes usar el valor por
  defecto (`xxxxxxxx`), pero es muy importante que uses un _secreto_ de verdad
  en producción.
* `ADMIN_EMAIL`: Opcionalmente podemos especificar un email y password para
  el usuario admin (root). Si estos detalles están presentes la aplicación se
  asegurará que exista el usuario y que tenga permisos de administrador. Valor
  por defecto `admin@localhost`.
* `ADMIN_PASSWORD`: Si hemos especificado un `ADMIN_EMAIL`, debemos pasar
  también una contraseña para el usuario admin. Valor por defecto: `changeme`.



## 6. Recursos usados

* [Express](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [docker](https://docs.docker.com/)
* [docker compose](https://docs.docker.com/compose/)
* [¿Qué es Docker? | Curso de Docker | Platzi Cursos](https://youtu.be/hQgvt-s-AHQ)
* [Postman](https://www.getpostman.com)
* [Variable de entorno - Wikipedia](https://es.wikipedia.org/wiki/Variable_de_entorno)
* [`process.env` - Node.js docs](https://nodejs.org/api/process.html#process_process_env)

---

## 7. HTTP API Checklist

### 7.1 `/`

* [x] `GET /`

### 7.2 `/auth`

* [x] `POST /auth`

### 7.3 `/users`

* [x] `GET /users`
* [x] `GET /users/:uid`
* [x] `POST /users`
* [x] `PUT /users/:uid`
* [x] `DELETE /users/:uid`

### 7.4 `/products`

* [x] `GET /products`
* [x] `GET /products/:productid`
* [x] `POST /products`
* [x] `PUT /products/:productid`
* [x] `DELETE /products/:productid`

### 7.4 `/orders`

* [x] `GET /orders`
* [x] `GET /orders/:orderId`
* [x] `POST /orders`
* [x] `PUT /orders/:orderId`
* [x] `DELETE /orders/:orderId`
