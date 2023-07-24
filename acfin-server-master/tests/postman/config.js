{
	"info": {
		"_postman_id": "678bd01f-39f3-49db-a2d8-608f7d28df61",
		"name": "R4DIS",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "Smoketest",
			"item": [
				{
					"name": "test",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/utilities/test",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"utilities",
								"test"
							]
						},
						"description": "Test route"
					},
					"response": []
				},
				{
					"name": "emailtest",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/utilities/emailtest",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"utilities",
								"emailtest"
							]
						},
						"description": "Test route"
					},
					"response": []
				}
			]
		},
		{
			"name": "Authenticate",
			"item": [
				{
					"name": "userRoleLogin",
					"item": [
						{
							"name": "userRoleLogin",
							"request": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"username\": \"rickjasonobrero@gmail.com\",\n    \"password\": \"7vXbRxp3ws\"\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/user/account/admin/login",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"user",
										"account",
										"admin",
										"login"
									]
								}
							},
							"response": []
						},
						{
							"name": "userRoleLogin:forceful",
							"request": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"username\": \"rickjasonobrero@gmail.com\",\n    \"password\": \"maroon123456\"\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/user/account/:_userRole/login?forceful=true",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"user",
										"account",
										":_userRole",
										"login"
									],
									"query": [
										{
											"key": "forceful",
											"value": "true"
										}
									],
									"variable": [
										{
											"key": "_userRole",
											"value": "admin"
										}
									]
								}
							},
							"response": []
						}
					]
				},
				{
					"name": "userLogin",
					"item": [
						{
							"name": "userLogin",
							"request": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"username\": \"user@mail.com\",\n    \"password\": \"maroon12345\"\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/user/account/login",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"user",
										"account",
										"login"
									]
								}
							},
							"response": []
						},
						{
							"name": "userLogin:forceful",
							"request": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"username\": \"user@mail.com\",\n    \"password\": \"maroon12345\"\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/user/account/login?forceful=true",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"user",
										"account",
										"login"
									],
									"query": [
										{
											"key": "forceful",
											"value": "true"
										}
									]
								}
							},
							"response": []
						}
					]
				},
				{
					"name": "logout",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"method": "GET",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/user/account/logout",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"user",
								"account",
								"logout"
							]
						}
					},
					"response": []
				},
				{
					"name": "session",
					"request": {
						"method": "POST",
						"header": [],
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/user/account/session",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"user",
								"account",
								"session"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "Admin",
			"item": [
				{
					"name": "View All",
					"item": [
						{
							"name": "viewAllUsers:keyValue pair",
							"request": {
								"method": "GET",
								"header": [],
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/users/_userRole?key=email&value=ella.flores@maroonstudios.com&dataview=admin",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"admin",
										"users",
										"_userRole"
									],
									"query": [
										{
											"key": "key",
											"value": "email"
										},
										{
											"key": "value",
											"value": "ella.flores@maroonstudios.com"
										},
										{
											"key": "advancedQuery",
											"value": "",
											"disabled": true
										},
										{
											"key": "start",
											"value": "",
											"disabled": true
										},
										{
											"key": "count",
											"value": "",
											"disabled": true
										},
										{
											"key": "sortBy",
											"value": "",
											"disabled": true
										},
										{
											"key": "asc",
											"value": "",
											"disabled": true
										},
										{
											"key": "total",
											"value": "true",
											"disabled": true
										},
										{
											"key": "dataview",
											"value": "admin"
										},
										{
											"key": "search",
											"value": "",
											"disabled": true
										}
									]
								}
							},
							"response": []
						},
						{
							"name": "viewAllUsers:advancedQuery",
							"request": {
								"method": "GET",
								"header": [],
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/users/:_userRole?advancedQuery={\"email\": \"jason.obrero@maroonstudios.com\"}",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"admin",
										"users",
										":_userRole"
									],
									"query": [
										{
											"key": "key",
											"value": "",
											"disabled": true
										},
										{
											"key": "value",
											"value": "",
											"disabled": true
										},
										{
											"key": "advancedQuery",
											"value": "{\"email\": \"jason.obrero@maroonstudios.com\"}"
										},
										{
											"key": "start",
											"value": "",
											"disabled": true
										},
										{
											"key": "count",
											"value": "",
											"disabled": true
										},
										{
											"key": "sortBy",
											"value": "",
											"disabled": true
										},
										{
											"key": "asc",
											"value": "",
											"disabled": true
										},
										{
											"key": "total",
											"value": "true",
											"disabled": true
										},
										{
											"key": "dataview",
											"value": "admin",
											"disabled": true
										},
										{
											"key": "search",
											"value": "",
											"disabled": true
										}
									],
									"variable": [
										{
											"key": "_userRole",
											"value": "guest"
										}
									]
								}
							},
							"response": []
						},
						{
							"name": "viewAllUsers:startCount",
							"request": {
								"method": "GET",
								"header": [],
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/users/:_userRole?start=0&count=1",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"admin",
										"users",
										":_userRole"
									],
									"query": [
										{
											"key": "key",
											"value": "",
											"disabled": true
										},
										{
											"key": "value",
											"value": "",
											"disabled": true
										},
										{
											"key": "advancedQuery",
											"value": "",
											"disabled": true
										},
										{
											"key": "sortBy",
											"value": "",
											"disabled": true
										},
										{
											"key": "asc",
											"value": "",
											"disabled": true
										},
										{
											"key": "total",
											"value": "true",
											"disabled": true
										},
										{
											"key": "dataview",
											"value": "admin",
											"disabled": true
										},
										{
											"key": "search",
											"value": "aar",
											"disabled": true
										},
										{
											"key": "start",
											"value": "0"
										},
										{
											"key": "count",
											"value": "1"
										}
									],
									"variable": [
										{
											"key": "_userRole",
											"value": "admin"
										}
									]
								}
							},
							"response": []
						},
						{
							"name": "viewAllUsers:sortBy",
							"request": {
								"method": "GET",
								"header": [],
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/users/:_userRole?sortBy=fullName&asc=-1",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"admin",
										"users",
										":_userRole"
									],
									"query": [
										{
											"key": "key",
											"value": "",
											"disabled": true
										},
										{
											"key": "value",
											"value": "",
											"disabled": true
										},
										{
											"key": "advancedQuery",
											"value": "",
											"disabled": true
										},
										{
											"key": "start",
											"value": "",
											"disabled": true
										},
										{
											"key": "count",
											"value": "",
											"disabled": true
										},
										{
											"key": "sortBy",
											"value": "fullName"
										},
										{
											"key": "asc",
											"value": "-1"
										},
										{
											"key": "total",
											"value": "true",
											"disabled": true
										},
										{
											"key": "dataview",
											"value": "admin",
											"disabled": true
										},
										{
											"key": "search",
											"value": "jo",
											"disabled": true
										}
									],
									"variable": [
										{
											"key": "_userRole",
											"value": "guest"
										}
									]
								}
							},
							"response": []
						},
						{
							"name": "viewAllUsers:dataView",
							"request": {
								"method": "GET",
								"header": [],
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/users/:_userRole?dataview=default",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"admin",
										"users",
										":_userRole"
									],
									"query": [
										{
											"key": "key",
											"value": "",
											"disabled": true
										},
										{
											"key": "value",
											"value": "",
											"disabled": true
										},
										{
											"key": "advancedQuery",
											"value": "",
											"disabled": true
										},
										{
											"key": "start",
											"value": "",
											"disabled": true
										},
										{
											"key": "count",
											"value": "",
											"disabled": true
										},
										{
											"key": "sortBy",
											"value": "email",
											"disabled": true
										},
										{
											"key": "asc",
											"value": "1",
											"disabled": true
										},
										{
											"key": "total",
											"value": "true",
											"disabled": true
										},
										{
											"key": "dataview",
											"value": "default"
										},
										{
											"key": "search",
											"value": "",
											"disabled": true
										}
									],
									"variable": [
										{
											"key": "_userRole",
											"value": "guest"
										}
									]
								}
							},
							"response": []
						},
						{
							"name": "viewAllUsers:dataView&search",
							"request": {
								"method": "GET",
								"header": [],
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/users/:_userRole?dataview=admin&search=aa",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"admin",
										"users",
										":_userRole"
									],
									"query": [
										{
											"key": "key",
											"value": "",
											"disabled": true
										},
										{
											"key": "value",
											"value": "",
											"disabled": true
										},
										{
											"key": "advancedQuery",
											"value": "",
											"disabled": true
										},
										{
											"key": "start",
											"value": "",
											"disabled": true
										},
										{
											"key": "count",
											"value": "",
											"disabled": true
										},
										{
											"key": "sortBy",
											"value": "email",
											"disabled": true
										},
										{
											"key": "asc",
											"value": "1",
											"disabled": true
										},
										{
											"key": "total",
											"value": "true",
											"disabled": true
										},
										{
											"key": "dataview",
											"value": "admin"
										},
										{
											"key": "search",
											"value": "aa"
										}
									],
									"variable": [
										{
											"key": "_userRole",
											"value": "guest"
										}
									]
								}
							},
							"response": []
						},
						{
							"name": "viewAllUsers:search",
							"request": {
								"method": "GET",
								"header": [],
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/users/:_userRole?search=aa",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"admin",
										"users",
										":_userRole"
									],
									"query": [
										{
											"key": "key",
											"value": "",
											"disabled": true
										},
										{
											"key": "value",
											"value": "",
											"disabled": true
										},
										{
											"key": "advancedQuery",
											"value": "",
											"disabled": true
										},
										{
											"key": "start",
											"value": "",
											"disabled": true
										},
										{
											"key": "count",
											"value": "",
											"disabled": true
										},
										{
											"key": "sortBy",
											"value": "email",
											"disabled": true
										},
										{
											"key": "asc",
											"value": "1",
											"disabled": true
										},
										{
											"key": "total",
											"value": "true",
											"disabled": true
										},
										{
											"key": "dataview",
											"value": "default",
											"disabled": true
										},
										{
											"key": "search",
											"value": "aa"
										}
									],
									"variable": [
										{
											"key": "_userRole",
											"value": "admin"
										}
									]
								}
							},
							"response": []
						}
					]
				},
				{
					"name": "View",
					"item": [
						{
							"name": "viewUser:playground",
							"request": {
								"method": "GET",
								"header": [],
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/user/:_userRole/:_id?dataview=admin",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"admin",
										"user",
										":_userRole",
										":_id"
									],
									"query": [
										{
											"key": "updates",
											"value": "true",
											"disabled": true
										},
										{
											"key": "from",
											"value": "2021-01-31T13:29:44.279Z",
											"disabled": true
										},
										{
											"key": "to",
											"value": "2021-01-31T13:29:44.281Z",
											"disabled": true
										},
										{
											"key": "dataview",
											"value": "admin"
										}
									],
									"variable": [
										{
											"key": "_userRole",
											"value": "admin"
										},
										{
											"key": "_id",
											"value": "60334453011e958073efc7e5"
										}
									]
								}
							},
							"response": []
						}
					]
				},
				{
					"name": "createUser",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"info\": {\n        \"firstName\": \"Rick Jason\",\n        \"middleName\": \"Gallarde\",\n        \"lastName\": \"Obrero\",\n        \"suffix\": \"Jr.\",\n        \"email\": \"rickjasonobrero@gmail.com\",\n        \"designation\": \"Sample Designation\",\n        \"department\": \"Sample Department\"\n    }\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/users/admin",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"admin",
								"users",
								"admin"
							]
						}
					},
					"response": []
				},
				{
					"name": "createUser (no params)",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"info\": {\n        \"firstName\": \"Rick\",\n        \"middleName\": \"Jason\",\n        \"lastName\": \"Obrero\",\n        \"email\": \"rgobrero@up.edu.ph\",\n        \"designation\": \"Sample Designation\",\n        \"department\": \"Sample Department\",\n        \"userRole\": \"admin\"\n    }\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/users",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"admin",
								"users"
							]
						}
					},
					"response": []
				},
				{
					"name": "viewAllUsers",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/users/:_userRole",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"admin",
								"users",
								":_userRole"
							],
							"query": [
								{
									"key": "key",
									"value": "email",
									"disabled": true
								},
								{
									"key": "value",
									"value": "rickjasonobrero@gmail.com",
									"disabled": true
								},
								{
									"key": "advancedQuery",
									"value": "",
									"disabled": true
								},
								{
									"key": "start",
									"value": "",
									"disabled": true
								},
								{
									"key": "count",
									"value": "",
									"disabled": true
								},
								{
									"key": "sortBy",
									"value": "",
									"disabled": true
								},
								{
									"key": "asc",
									"value": "",
									"disabled": true
								},
								{
									"key": "total",
									"value": "true",
									"disabled": true
								},
								{
									"key": "dataview",
									"value": "admin",
									"disabled": true
								},
								{
									"key": "search",
									"value": "",
									"disabled": true
								}
							],
							"variable": [
								{
									"key": "_userRole",
									"value": "admin"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "viewAllUsers (no params)",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/users",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"admin",
								"users"
							],
							"query": [
								{
									"key": "key",
									"value": "email",
									"disabled": true
								},
								{
									"key": "value",
									"value": "rickjasonobrero@gmail.com",
									"disabled": true
								},
								{
									"key": "advancedQuery",
									"value": "",
									"disabled": true
								},
								{
									"key": "start",
									"value": "",
									"disabled": true
								},
								{
									"key": "count",
									"value": "",
									"disabled": true
								},
								{
									"key": "sortBy",
									"value": "",
									"disabled": true
								},
								{
									"key": "asc",
									"value": "",
									"disabled": true
								},
								{
									"key": "total",
									"value": "true",
									"disabled": true
								},
								{
									"key": "dataview",
									"value": "admin",
									"disabled": true
								},
								{
									"key": "search",
									"value": "",
									"disabled": true
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "viewUser",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/user/:_userRole/:_id",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"admin",
								"user",
								":_userRole",
								":_id"
							],
							"query": [
								{
									"key": "updates",
									"value": "",
									"disabled": true
								},
								{
									"key": "to",
									"value": "",
									"disabled": true
								},
								{
									"key": "from",
									"value": "",
									"disabled": true
								},
								{
									"key": "dataview",
									"value": "default",
									"disabled": true
								}
							],
							"variable": [
								{
									"key": "_userRole",
									"value": "admin"
								},
								{
									"key": "_id",
									"value": "603dbcc797379054e8038a83"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "updateUser",
					"request": {
						"method": "PATCH",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"info\": {\n        \"designation\": \"New Designation\"\n    }\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/user/:_userRole/:_id",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"admin",
								"user",
								":_userRole",
								":_id"
							],
							"variable": [
								{
									"key": "_userRole",
									"value": "admin"
								},
								{
									"key": "_id",
									"value": "6038cf7f969c8dd05c2977a4"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "deleteUser",
					"request": {
						"method": "DELETE",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/user/admin/:_id",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"admin",
								"user",
								"admin",
								":_id"
							],
							"variable": [
								{
									"key": "_id",
									"value": "6038cfd0e2cf50d159c7f411"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "activate",
					"request": {
						"method": "PATCH",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"activationReason\": \"Suspension lifted.\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/user/:_userRole/:_id/activate",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"admin",
								"user",
								":_userRole",
								":_id",
								"activate"
							],
							"variable": [
								{
									"key": "_userRole",
									"value": "admin"
								},
								{
									"key": "_id",
									"value": "6038cc85fc96a3c3b9dd3a08"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "deactivate",
					"request": {
						"method": "PATCH",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"deactivationReason\": \"One week suspension.\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/user/:_userRole/:_id/deactivate",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"admin",
								"user",
								":_userRole",
								":_id",
								"deactivate"
							],
							"variable": [
								{
									"key": "_userRole",
									"value": "admin"
								},
								{
									"key": "_id",
									"value": "6038cc85fc96a3c3b9dd3a08"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "delete",
					"request": {
						"method": "PATCH",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"activationReason\": \"Suspension lifted.\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/user/:_userRole/:_id/delete",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"admin",
								"user",
								":_userRole",
								":_id",
								"delete"
							],
							"variable": [
								{
									"key": "_userRole",
									"value": "admin"
								},
								{
									"key": "_id",
									"value": "6038cc85fc96a3c3b9dd3a08"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "viewVersion",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/user/:_userRole/:_id/version/:_version",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"admin",
								"user",
								":_userRole",
								":_id",
								"version",
								":_version"
							],
							"variable": [
								{
									"key": "_userRole",
									"value": "admin"
								},
								{
									"key": "_id",
									"value": "60352121b796d193ad1f73a8"
								},
								{
									"key": "_version",
									"value": "0"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "patchVersion",
					"request": {
						"method": "PATCH",
						"header": [],
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/admin/user/:_userRole/:_id/version/:_version",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"admin",
								"user",
								":_userRole",
								":_id",
								"version",
								":_version"
							],
							"variable": [
								{
									"key": "_userRole",
									"value": "admin"
								},
								{
									"key": "_id",
									"value": "6016fddf5584ab498e142df9"
								},
								{
									"key": "_version",
									"value": "1"
								}
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "Password",
			"item": [
				{
					"name": "Change Password",
					"item": [
						{
							"name": "createChangeOTP",
							"request": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"password\": \"iOAc5Jbltp\"\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/user/password/requestchange",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"user",
										"password",
										"requestchange"
									]
								}
							},
							"response": []
						},
						{
							"name": "changePasswordLoggedIn",
							"request": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"password\": \"maroon12345\",\n    \"otp\": \"339790\"\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/user/password/change",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"user",
										"password",
										"change"
									]
								}
							},
							"response": []
						}
					]
				},
				{
					"name": "Reset Password",
					"item": [
						{
							"name": "resetPasswordOTP",
							"request": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"username\": \"rickjasonobrero@gmail.com\"\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/user/password/requestreset",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"user",
										"password",
										"requestreset"
									]
								}
							},
							"response": []
						},
						{
							"name": "resetPassword",
							"protocolProfileBehavior": {
								"disableBodyPruning": true
							},
							"request": {
								"method": "GET",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"username\": \"rickjasonobrero@gmail.com\"\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/user/password/reset?username=rickjasonobrero@gmail.com&email=rickjasonobrero%40gmail.com&otp=436184",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"user",
										"password",
										"reset"
									],
									"query": [
										{
											"key": "username",
											"value": "rickjasonobrero@gmail.com"
										},
										{
											"key": "email",
											"value": "rickjasonobrero%40gmail.com"
										},
										{
											"key": "otp",
											"value": "436184"
										}
									]
								}
							},
							"response": []
						},
						{
							"name": "changePasswordReset",
							"request": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"password\": \"maroon123456\",\n    \"otp\": \"436184\",\n    \"username\": \"rickjasonobrero@gmail.com\"\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/user/password/change",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"user",
										"password",
										"change"
									]
								}
							},
							"response": []
						}
					]
				},
				{
					"name": "Forgot Password",
					"item": [
						{
							"name": "resetPasswordOTP",
							"request": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"username\": \"rgobrero@up.edu.ph\"\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/user/password/forgot",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"user",
										"password",
										"forgot"
									]
								}
							},
							"response": []
						},
						{
							"name": "resetPassword",
							"protocolProfileBehavior": {
								"disableBodyPruning": true
							},
							"request": {
								"method": "GET",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"username\": \"rickjasonobrero@gmail.com\"\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/user/password/reset?username=rickjasonobrero@gmail.com&email=rickjasonobrero%40gmail.com&otp=436184",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"user",
										"password",
										"reset"
									],
									"query": [
										{
											"key": "username",
											"value": "rickjasonobrero@gmail.com"
										},
										{
											"key": "email",
											"value": "rickjasonobrero%40gmail.com"
										},
										{
											"key": "otp",
											"value": "436184"
										}
									]
								}
							},
							"response": []
						},
						{
							"name": "changePasswordReset",
							"request": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\n    \"password\": \"maroon123456\",\n    \"otp\": \"097229\",\n    \"username\": \"rgobrero@up.edu.ph\"\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/user/password/change",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"user",
										"password",
										"change"
									]
								}
							},
							"response": []
						}
					]
				}
			]
		},
		{
			"name": "Profile",
			"item": [
				{
					"name": "View",
					"item": [
						{
							"name": "viewUser:playground",
							"request": {
								"method": "GET",
								"header": [],
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/user/myprofile?dataview=admin",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"user",
										"myprofile"
									],
									"query": [
										{
											"key": "updates",
											"value": "true",
											"disabled": true
										},
										{
											"key": "from",
											"value": "2021-01-31T13:29:44.279Z",
											"disabled": true
										},
										{
											"key": "to",
											"value": "2021-01-31T13:29:44.281Z",
											"disabled": true
										},
										{
											"key": "dataview",
											"value": "admin"
										}
									]
								}
							},
							"response": []
						}
					]
				},
				{
					"name": "viewProfile",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/user/myprofile",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"user",
								"myprofile"
							]
						}
					},
					"response": []
				},
				{
					"name": "updateProfile",
					"request": {
						"method": "PATCH",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"info\": {\n        \"email\": \"rgobrero@up.edu.ph\",\n        \"lastName\": \"Oberon\"\n    }\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/user/myprofile",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"user",
								"myprofile"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "Role",
			"item": [
				{
					"name": "create",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"roleName\": \"sample\",\n    \"features\": [\n        \"loginByUserRole\",\n        \"login\",\n        \"logout\",\n        \"session\",\n        \"verifyEmail\"\n    ]\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/config/roleaccess",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"config",
								"roleaccess"
							]
						}
					},
					"response": []
				},
				{
					"name": "viewAll",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/config/roleaccess",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"config",
								"roleaccess"
							]
						}
					},
					"response": []
				},
				{
					"name": "view",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/config/roleaccess/:_roleName",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"config",
								"roleaccess",
								":_roleName"
							],
							"variable": [
								{
									"key": "_roleName",
									"value": "sample"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "session",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/config/roleaccess/session",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"config",
								"roleaccess",
								"session"
							]
						}
					},
					"response": []
				},
				{
					"name": "update",
					"request": {
						"method": "PATCH",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"features\": [\n        {\n            \"value\": \"loginByUserRole\",\n            \"available\": false\n        }\n    ],\n    \"label\": \"sample\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/config/roleaccess/:_roleName",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"config",
								"roleaccess",
								":_roleName"
							],
							"variable": [
								{
									"key": "_roleName",
									"value": "sample"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "delete",
					"request": {
						"method": "DELETE",
						"header": [],
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/config/roleaccess/:_roleName",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"config",
								"roleaccess",
								":_roleName"
							],
							"variable": [
								{
									"key": "_roleName",
									"value": "sample"
								}
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "Base CRUD",
			"item": [
				{
					"name": "Create",
					"event": [
						{
							"listen": "test",
							"script": {
								"exec": [
									""
								],
								"type": "text/javascript"
							}
						}
					],
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"name\": \"Disease Indication Y\",\r\n    \"potentialBioactivity\": \"Some bioactivity\"\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/diseaseIndication",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"diseaseIndication"
							]
						},
						"description": "Vanilla Post Request"
					},
					"response": [
						{
							"name": "Institution",
							"originalRequest": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\r\n    \"name\": \"Some Private Institution\",\r\n    \"type\": \"Private Company\"\r\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/institution",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"institution"
									]
								}
							},
							"_postman_previewlanguage": "json",
							"header": null,
							"cookie": [],
							"body": "{\r\n    \"message\": \"Created an entry for institution.\",\r\n    \"entry\": {\r\n        \"_status\": \"active\",\r\n        \"_id\": \"6058236c0175d0194d68fd3d\",\r\n        \"name\": \"Some Private Institution\",\r\n        \"type\": \"Private Company\",\r\n        \"__v\": 0,\r\n        \"dateUpdated\": \"2021-03-22T04:56:12.702Z\",\r\n        \"dateCreated\": \"2021-03-22T04:56:12.702Z\"\r\n    }\r\n}"
						},
						{
							"name": "Assay",
							"originalRequest": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\r\n    \"name\": \"Some Orthogonal Assay\",\r\n    \"researchLaboratory\": [\"60581db00175d0194d68fb28\", \"60581d9e0175d0194d68fb17\"],\r\n    \"institution\": [\"60581d3d0175d0194d68faba\", \"6058236c0175d0194d68fd3d\"],\r\n    \"diseaseIndication\": [\"6058400d0175d0194d696374\", \"605840100175d0194d69637f\", \"60583fcb0175d0194d69623c\"],\r\n    \"assayClassification\": \"Orthogonal Assay\"\r\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/assay",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"assay"
									]
								}
							},
							"status": "Created",
							"code": 201,
							"_postman_previewlanguage": "json",
							"header": [
								{
									"key": "X-Powered-By",
									"value": "Express"
								},
								{
									"key": "Vary",
									"value": "Origin"
								},
								{
									"key": "Access-Control-Allow-Credentials",
									"value": "true"
								},
								{
									"key": "Content-Type",
									"value": "application/json; charset=utf-8"
								},
								{
									"key": "Content-Length",
									"value": "277"
								},
								{
									"key": "ETag",
									"value": "W/\"115-zN7r64DOtaWu8g/yual4gcKlRCo\""
								},
								{
									"key": "Set-Cookie",
									"value": "connect.sid=s%3A7mCmQrSnW0-f1aetXIYXntZkIwje0WsP.9%2F7GY1oxTIq0PRCLRd0W1L4YhL5m%2FjERiXu%2FJ6TOu9w; Path=/; Expires=Mon, 22 Mar 2021 04:29:52 GMT; HttpOnly"
								},
								{
									"key": "Date",
									"value": "Mon, 22 Mar 2021 03:59:52 GMT"
								},
								{
									"key": "Connection",
									"value": "keep-alive"
								},
								{
									"key": "Keep-Alive",
									"value": "timeout=5"
								}
							],
							"cookie": [],
							"body": "{\n    \"message\": \"Created an entry for assay.\",\n    \"entry\": {\n        \"researchLaboratory\": [\n            {\n                \"institution\": [\n                    {\n                        \"_status\": \"active\",\n                        \"_id\": \"60581d3d0175d0194d68faba\",\n                        \"name\": \"Some Research Institution\",\n                        \"type\": \"Research Development Institution\",\n                        \"__v\": 0,\n                        \"dateUpdated\": \"2021-03-22T04:29:49.333Z\",\n                        \"dateCreated\": \"2021-03-22T04:29:49.333Z\"\n                    }\n                ],\n                \"contactDetails\": [\n                    \"8118111\"\n                ],\n                \"_status\": \"active\",\n                \"_id\": \"60581db00175d0194d68fb28\",\n                \"name\": \"Research Laboratory\",\n                \"__v\": 0,\n                \"dateUpdated\": \"2021-03-22T04:31:44.796Z\",\n                \"dateCreated\": \"2021-03-22T04:31:44.796Z\"\n            }\n        ],\n        \"institution\": [\n            {\n                \"_status\": \"active\",\n                \"_id\": \"60581d3d0175d0194d68faba\",\n                \"name\": \"Some Research Institution\",\n                \"type\": \"Research Development Institution\",\n                \"__v\": 0,\n                \"dateUpdated\": \"2021-03-22T04:29:49.333Z\",\n                \"dateCreated\": \"2021-03-22T04:29:49.333Z\"\n            }\n        ],\n        \"diseaseIndication\": [],\n        \"_status\": \"active\",\n        \"_id\": \"6058250a0175d0194d68ff40\",\n        \"name\": \"Some Assay\",\n        \"assayClassification\": \"Toxicity Assay\",\n        \"__v\": 0,\n        \"dateUpdated\": \"2021-03-22T05:03:05.977Z\",\n        \"dateCreated\": \"2021-03-22T05:03:05.977Z\"\n    }\n}"
						},
						{
							"name": "DiseaseIndication",
							"originalRequest": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\r\n    \"name\": \"Disease Indication Y\",\r\n    \"potentialBioactivity\": \"Some bioactivity\"\r\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/diseaseindication",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"diseaseindication"
									]
								}
							},
							"status": "Created",
							"code": 201,
							"_postman_previewlanguage": "json",
							"header": [
								{
									"key": "X-Powered-By",
									"value": "Express"
								},
								{
									"key": "Vary",
									"value": "Origin"
								},
								{
									"key": "Access-Control-Allow-Credentials",
									"value": "true"
								},
								{
									"key": "Content-Type",
									"value": "application/json; charset=utf-8"
								},
								{
									"key": "Content-Length",
									"value": "1605"
								},
								{
									"key": "ETag",
									"value": "W/\"645-ZUD68i83qf8FYSGRsBYa0eZrOm8\""
								},
								{
									"key": "Set-Cookie",
									"value": "connect.sid=s%3A7mCmQrSnW0-f1aetXIYXntZkIwje0WsP.9%2F7GY1oxTIq0PRCLRd0W1L4YhL5m%2FjERiXu%2FJ6TOu9w; Path=/; Expires=Mon, 22 Mar 2021 06:44:55 GMT; HttpOnly"
								},
								{
									"key": "Date",
									"value": "Mon, 22 Mar 2021 06:14:55 GMT"
								},
								{
									"key": "Connection",
									"value": "keep-alive"
								},
								{
									"key": "Keep-Alive",
									"value": "timeout=5"
								}
							],
							"cookie": [],
							"body": "{\n    \"message\": \"Created an entry for diseaseIndication.\",\n    \"entry\": {\n        \"_status\": \"active\",\n        \"_id\": \"605840100175d0194d69637f\",\n        \"name\": \"Disease Indication Y\",\n        \"potentialBioactivity\": \"Some bioactivity\",\n        \"__v\": 0,\n        \"dateUpdated\": \"2021-03-22T06:58:24.466Z\",\n        \"dateCreated\": \"2021-03-22T06:58:24.466Z\"\n    }\n}"
						},
						{
							"name": "Laboratory",
							"originalRequest": {
								"method": "POST",
								"header": [],
								"body": {
									"mode": "raw",
									"raw": "{\r\n    \"name\": \"Research Laboratory\",\r\n    \"institution\": [\"60581d3d0175d0194d68faba\"],\r\n    \"contactDetails\": 8118111\r\n}",
									"options": {
										"raw": {
											"language": "json"
										}
									}
								},
								"url": {
									"raw": "{{domain}}:{{port}}{{baseUrl}}/laboratory",
									"host": [
										"{{domain}}"
									],
									"port": "{{port}}{{baseUrl}}",
									"path": [
										"laboratory"
									]
								}
							},
							"_postman_previewlanguage": "json",
							"header": null,
							"cookie": [],
							"body": "{\n    \"message\": \"Created an entry for laboratory.\",\n    \"entry\": {\n        \"institution\": [\n            {\n                \"_status\": \"active\",\n                \"_id\": \"60581d3d0175d0194d68faba\",\n                \"name\": \"Some Research Institution\",\n                \"type\": \"Research Development Institution\",\n                \"__v\": 0,\n                \"dateUpdated\": \"2021-03-22T04:29:49.333Z\",\n                \"dateCreated\": \"2021-03-22T04:29:49.333Z\"\n            }\n        ],\n        \"contactDetails\": [\n            \"8118111\"\n        ],\n        \"_status\": \"active\",\n        \"_id\": \"60581db00175d0194d68fb28\",\n        \"name\": \"Research Laboratory\",\n        \"__v\": 0,\n        \"dateUpdated\": \"2021-03-22T04:31:44.796Z\",\n        \"dateCreated\": \"2021-03-22T04:31:44.796Z\"\n    }\n}"
						}
					]
				},
				{
					"name": "View All",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/assay?dataView=admin",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"assay"
							],
							"query": [
								{
									"key": "dataView",
									"value": "admin"
								}
							]
						},
						"description": "Vanilla Get Request for all Institutions."
					},
					"response": []
				},
				{
					"name": "View",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/assay/6058250a0175d0194d68ff40",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"assay",
								"6058250a0175d0194d68ff40"
							]
						}
					},
					"response": []
				},
				{
					"name": "Update",
					"request": {
						"method": "PATCH",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"diseaseIndication\": [\"6058400d0175d0194d696374\", \"605840100175d0194d69637f\", \"60583fcb0175d0194d69623c\"]\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/assay/605834b20175d0194d690dc1",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"assay",
								"605834b20175d0194d690dc1"
							]
						}
					},
					"response": []
				},
				{
					"name": "Delete",
					"request": {
						"method": "DELETE",
						"header": [],
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/assay/605835df0175d0194d690f7e",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"assay",
								"605835df0175d0194d690f7e"
							]
						}
					},
					"response": []
				},
				{
					"name": "Delete Many",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\r\n    \"ids\": [\"60472aa1baca9e0aa89f8ea2\", \"6051aeb344d67621808a57dd\"]\r\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{domain}}:{{port}}{{baseUrl}}/institution/multiple/delete",
							"host": [
								"{{domain}}"
							],
							"port": "{{port}}{{baseUrl}}",
							"path": [
								"institution",
								"multiple",
								"delete"
							]
						}
					},
					"response": []
				}
			],
			"description": "Vanilla base CRUD."
		}
	]
}