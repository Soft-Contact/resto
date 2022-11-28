<a name="top"></a>
# Soft-Contact JSON API protocol

## Table of contents
- [Soft-Contact JSON API protocol](#soft-contact-json-api-protocol)
  * [Introduction](#introduction)
  * [Overview](#overview)
  * [Technical description](#technical-description)
  * [Basic access authentication](#basic-access-authentication)
  * [Common objects](#common-objects)
    + [Restaurant](#restaurant)
    + [Contact](#contact)
    + [Open hours](#open-hours)
    + [Open hour](#open-hour)
    + [Menu](#menu)
    + [Article](#article)
    + [Price](#price)
    + [Article Option](#article-option)
    + [Receipt](#receipt)
    + [Article Options / Chosen Options](#article-options---chosen-options)
    + [Receipt Row](#receipt-row)
    + [Discount](#discount)
    + [Payment Row](#payment-row)
    + [Customer](#customer)
    + [Card](#card)
    + [Printer](#printer)
    + [Bookkeeping Row](#bookkeeping-row)
    + [Campaign](#campaign)
    + [Campaign Unit Row](#campaign-unit-row)
    + [Campaign Article Row](#campaign-article-row)
  * [Available Methods](#available-methods)
    + [listRestaurants](#listrestaurants)
    + [getReceipts](#getreceipts)
    + [getBookkeepingRows](#getbookkeepingrows)
    + [saveReceipts](#savereceipts)
    + [listCustomers](#listcustomers)
    + [importCustomers](#importcustomers)
    + [listCards](#listcards)
    + [importCards](#importcards)
    + [listCampaigns](#listCampaigns)
    
  * [Receipt types](#receipt-types)
  * [Discount methods](#discount-methods)
  * [Customer types](#customer-types)
  * [Customer invoicing methods](#customer-invoicing-methods)
  * [Customer invoicing periods](#customer-invoicing-periods)
  * [Customer invoice contents](#customer-invoice-contents)
  * [Card types](#card-types)
  * [Version history](#version-history)


<a name="introduction"></a>
## Introduction

This documents specifies the protocol for reading and importing a subset
of Restolution data using [Soft-Contact's](https://soft-contact.fi/) Soft-Contact JSON API.

<a name="overview"></a>
## Overview

The RESTO JSON API has a limited set of functionality for exporting and importing base and sales data from Restolution.
The Restolution domain is represented JSON objects tailored for specific needs.
All fields are mandatory, unless described as "optional".

<a name="technical-description"></a>
## Technical description

* see [Soft-Contact JSON API Protocol Technical Description](resto_json_api_technical_description.md)

<a name="basic-access-authentication"></a>
## Basic access authentication

Soft-Contact JSON API also supports Basic access authentication (over HTTPS) as alternative to
the encoding and hash described in [Soft-Contact JSON API Protocol Technical Description](resto_json_api_technical_description.md).
Note: When using Basic access authentication, the "apiKey" field is NOT required in the request JSON.

<a name="common-objects"></a>
## Common objects

List of common objects used in the request/response of different methods.

<a name="restaurant"></a>
### Restaurant

A Restaurant is a BusinessUnit in Restolution.

* ``restaurantID`` - restaurant ID, business unit code in Restolution
* ``cashRegisterUUID`` - cash register UUID of cash register where restaurant orders are directed
* ``businessUnitUUID`` - business unit UUID of this restaurant, globally unique identifier for this restaurant
* ``name`` - restaurant name
* ``contact`` - restaurant contact information as a Contact object
* ``openHours`` - restaurant open hours as an array of Open hours objects
* ``menus`` - array of Menu objects (empty if articles are not included)
* ``customers`` - array of Customer objects (empty if customers are not included)
* ``printers`` - array of Printer objects
* ``status`` - status of restaurant.  Can be one of ``ACTIVE``, ``NEW``, ``DISABLED``. Included only if ``includeAllRestaurants`` is ``true``.
* ``units`` - array of Unit objects, operational units in Restolution.

<a name="contact"></a>
### Contact

* ``emailAddress`` - email address
* ``street`` - street
* ``city`` - city
* ``postIndex`` - post index
* ``phoneNr`` - phone number
* ``mobilePhoneNr`` - mobile phone number
* ``wwwAddress`` - www address to e.g. restaurant website
* ``faxNr`` - fax number
* ``registrationNr`` - registration number of the business unit
* ``companyName`` - company name, the name of the company linked to the business unit

<a name="open-hours"></a>
### Open hours
Contains an array of ``<Weekday>`` that can be _"Monday"_, _"Tuesday"_, _"Wednesday"_, _"Thursday"_, _"Friday"_, _"Saturday"_ or _"Sunday"_. All 7 weekdays are always included. 

* ``<Weekday>`` - an array of Open hour objects. An empty array means that the restaurant is closed for that day.

<a name="open-hour"></a>
### Open hour
* ``start`` - time when open hour starts in the format HHmm.
* ``finish`` - time when open our finishes in the format HHmm. Finish time can extend to the next day by setting it to end at _"2400"_ in an Open Hour and in the next day an Open Hour starting from _"0000"_. If the restaurant is open 24h, start would be _"0000"_ and finish _"2400"_.
* ``type`` - open hour type, see [Open hour types](#open-hour-types).

<a name="menu"></a>
### Menu

A Menu is an ArticleGroup in Restolution.

* ``menuID`` - menu ID, article group number in Restolution
* ``name`` - menu name
* ``articles`` - array of Article objects belonging to this menu

<a name="article"></a>
### Article

Articles correspond to active sale articles in Restolution, belonging to the assortment of the Restaurant cash register

* ``articleID`` - article ID, sale article number in Restolution
* ``name`` - article name
* ``description`` - article description
* ``type`` - type of article, SALE = normal sale article, OPTION = option article
* ``includeOptionPrice`` - flag to indicate whether option article's price should be included in order row price
* ``options`` - array of (type = OPTION) option article IDs
* ``prices`` - array of Price objects valid for this article
* ``printerIDs`` - array printer IDs
* ``structure`` - array of Articles if this is a link article
* ``amount`` - amount of this article in link article structure in in 1/1000 parts

<a name="price"></a>
### Price

* ``priceID`` - price level ID, price class number in Restolution
* ``price`` - unit price including VAT in cents
* ``tax`` - tax percentage

<a name="article-option"></a>
### Article Option

* ``articleOptionID`` - option list ID, sale article number in Restolution
* ``name`` - article option name
* ``minSelections`` - minimum number of required selections
* ``maxSelection`` - maximum number of allowed selections
* ``articleIDs`` - array of article IDs to select from

<a name="unit"></a>
### Unit

* ``unitName`` - unit name
* ``unitUUID`` - unit UUID of this unit, globally unique identifier for this unit

<a name="receipt"></a>
### Receipt

A receipt is a completed order that can be saved to back office using the "saveReceipts" method
or read using "getReceipts" method.

* ``receiptID`` - receipt ID, used as receipt number in Restolution
* ``receiptUUID`` - optional receipt UUID, globally unique identifier for this receipt (a type 4 UUID as specified by RFC 4122)
* ``sourceHash`` - md5 hash from receipt "source" data to prevent double receipts
* ``cancelledReceiptSourceHash`` - matches the _sourceHash_ of the receipt cancelled by this receipt, only in receipts of type "VOID"
* ``receiptType``- receipt type, used in "getReceipts", see Receipt types
* ``timestamp`` - time when the receipt was created (mandatory field to ensure no duplicate receipts are saved)
* ``cashRegisterUUID`` - cash register UUID
* ``businessUnitUUID`` - business unit UUID
* ``cashRegisterName`` - optional cash register name
* ``customerNumber`` - customer number
* ``customerName`` - optional customer name
* ``customerUUID`` - customer UUID
* ``cardNumber`` - optional card number
* ``ourReference`` - Restaurant's own reference information
* ``yourReference`` - Restaurant customer's reference information
* ``restaurantID`` - optional Restaurant ID
* ``restaurantName`` - restaurant name, used in  "getReceipts".
* ``customerQuantity`` - customer quantity, used in  "getReceipts".
* ``freeText`` - receipt free text, used in "getReceipts"
* ``memoInfo`` - receipt memo info, used in "getReceipts"
* ``quickInvoice`` - true if receipt has been finalized as a quick invoice in cash register
* ``tableCode`` - optional table code
* ``receiptRows`` - an array of [Receipt Row](#receipt-row) objects
* ``paymentRows`` - an array of [Payment Row](#payment-row) objects

<a name="article-options---chosen-options"></a>
### Article Options / Chosen Options

* ``optionListID`` - option list ID
* ``articleIDs`` - array containing list of article IDs (condiments, messages)

<a name="receipt-row"></a>
### Receipt Row

* ``articleID`` - article ID, sale article number in Restolution
* ``articleName`` - optional article name, this is the common article name in Restolution
* ``additionalArticleName`` - article name as seen on the receipt that this receipt row belongs to, this is the operational unit's article name in Restolution
* ``priceID`` - price level
* ``price`` - unit price including VAT in cents
* ``quantity`` - ordered quantity in 1/1000 parts
* ``amount`` - optional row total amount in cents including VAT after discounts
* ``tax`` - tax percentage
* ``timestamp`` - timestamp when this sale was created
* ``unitName`` - unit name, operational unit name in Restolution
* ``clerkNumber`` - number of clerk who made the sale
* ``clerkName`` - name of clerk who made the sale
* ``mainGroupNumber`` - main group number
* ``mainGroupName`` - main group name
* ``articleGroupNumber`` - article group number
* ``articleGroupName`` - article group name
* ``saleID`` - sale ID of sale row, receipt sale id in Restolution
* ``parentID`` - parent ID of sale row, foreign key to sale ID of parent sale row
* ``discounts`` - an array of discounts
* ``rowComment`` - optional row comment
* ``accountCode`` - optional code of the Bookkeeping account that this receipt row belongs to, see also ``includeAccountingInfo`` in [getReceipts](#getreceipts)

<a name="discount"></a>
### Discount

* ``method`` - row discount method, see Discount methods
* ``name`` - row discount name
* ``code`` - row discount code
* ``value`` - row discount value
* ``amount`` - row discount amount in cents including VAT

<a name="payment-row"></a>
### Payment Row

Every third party has a reserved payment code (or codes) for any payments they handle.

* ``timestamp`` - time when the payment row was created (if missing, the value will be copied from containing Receipt's timestamp)
* ``paymentCode`` - payment type code, transaction type code in Restolution
* ``paymentName`` - optional payment type name, transaction type name in Restolution
* ``amount`` - amount in cents
* ``quantity`` - optional quantity of payments in 1/1000 parts
* ``transactionId`` - optional transaction ID from payment authorizer
* ``transactionTimestamp`` - optional timestamp from payment authorizer
* ``accountCode`` - optional code of the Bookkeeping account that this payment row belongs to, see also ``includeAccountingInfo`` in [getReceipts](#getreceipts) 

<a name="customer"></a>
### Customer

See also [listCustomers](#listcustomers).

* ``customerNumber`` - customer ID, customer number in Restolution
* ``customerName`` - customer name
* ``clientName`` - client name that this customer belongs to. If used in [importCustomers](#importcustomers), the customer will only be imported to this client and respectively if missing, the customer will be imported to all clients.
* ``customerUUID`` - customer UUID. If used in [importCustomers](#importcustomers), the import will only affect a customer with this customer UUID in Restolution. If used in [saveReciepts](#saveReceipts), this will override customerNumber when selecting customer for imported receipt.
* ``active`` - flag to indicate whether customer should be active or not in Restolution
* ``type`` - optional customer type, see [Customer types](#customer-types). Defaults to "LUNCH" for new customer if not given.
* ``comment`` - optional additional comment about customer
* ``referenceNumber`` - optional customer reference number
* ``additionalName`` - optional customer additional name
* ``contactPerson`` - optional customer contact person
* ``nameSendToCashRegister`` - optional customer name that will be sent to cash register
* ``contractNumber`` - optional customer contract number
* ``allowCardCrediting`` - optional flag to allow/disallow crediting of card balances in cash register (default = false)
* ``allowInvoicing`` - optional flag to allow/disallow customer invoicing (default = false)
* ``invoiceMethod`` - optional setting how customer invoices should be generated, see [Customer invoicing methods](#customer-invoicing-methods)
* ``invoicePeriod`` - optional setting how often customer invoices should be generated, see Customer invoicing periods
* ``invoiceContent`` - optional setting how the invoiced receipts should be arranged into invoices, see [Customer invoice contents](#customer-invoice-contents)
* ``invoiceDeliveryAddress`` - optional customer invoice delivery address
* ``invoiceDeliveryEmail`` - optional customer invoice delivery email address
* ``einvoiceReceiver`` - optional customer e-invoice receiver
* ``einvoiceReceiverIntermediator`` - optional customer e-invoice receiver intermediator
* ``subventionsOnceAMonth`` - optional flag to indicate that subvention and commission invoices should be generated on the 1st day of every month
* ``subventionInvoiceContent`` - optional setting how the subvention and commission receipts should be arranged into invoices, see [Customer invoice contents](#customer-invoice-contents)
* ``contact`` - optional customer contact information as a Contact object. This object is omitted in results if no contact fields have been set in Restolution. See [Contact](#contact).
* ``restaurantIDs`` - optional special field, array of Restaurant IDs where this Customer is active. Note: Used only in [importCustomers](#importcustomers). If not defined, the customer will be set active in every restaurant.
* ``businessUnitUUIDs`` - optional special field, array of Business Unit UUIDs of restaurants where this Customer is active. Note: Used only in [importCustomers](#importcustomers). If not defined, the customer will be set active in every restaurant.

<a name="card"></a>
### Card
See also [listCards](#listcards).

* ``cardNumber`` - card ID, card number in Restolution
* ``customerNumber`` - customer ID of customer this card belongs to
* ``type`` - card type, see [Card types](#card-types). Defaults to "LOYALTY" for new card if not given.
* ``active`` - flag to indicate whether card should be active or not in Restolution
* ``validUntil`` - optional valid until date for this card
* ``holderName`` - optional holder name of this card
* ``personCode`` - optional person code of the card holder
* ``department`` - optional card department
* ``departmentName`` - optional card department name
* ``accountCode`` - optional card account code
* ``workHoursPerWeek`` - optional card work hours per week
* ``originalNumber`` - optional special field, specifies card number of card in Restolution to be replaced with this card. Note: Used only in [importCards](#importcards).

<a name="printer"></a>
### Printer

* ``printerID`` - printer ID, 1 - 10
* ``name`` - printer name
* ``address`` - IP address
* ``port`` - port number
* ``width`` - line width (in characters)

<a name="bookkeeping-row"></a>
### Bookkeeping Row

* ``saleDate`` - sale date for bookkeeping row, truncated to date level
* ``companyCode`` - company code
* ``costCentreCode`` - cost centre code
* ``accountCode`` - bookkeeping account code
* ``code`` - bookkeeping code, article group SAP code or transaction type code in Restolution
* ``amount`` - sum of sales (negative), payments (positive) and inpayments (negative) in cents
* ``netAmount`` - amount without VAT in cents
* ``vatAmount`` - VAT amount in cents
* ``vatCode`` - VAT code

<a name="campaign"></a>
### Campaign
See also [listCampaigns](#listCampaigns).

* ``campaignName`` - campaign name
* ``goal`` - text describing goal of this campaign
* ``comment`` - comment of this campaign
* ``campaignType`` - campaign type, see [Campaign types](#campaign-types)
* ``campaignSubType`` - campaign subordinate type, see [Campaign Sub types](#campaign-sub-types)
* ``weekdayMon``,``weekdayTue``,``weekdayWed``,``weekdayThu``,``weekdayFri``,``weekdaySat``,``weekdaySun`` - flags indicating weekdays when when this campaign is active during the ``fromDate``-``untilDate``
* ``startTime``,``endTime`` - time period of the saleday in form of ``hh:mm`` when this campaign is active, if not set then campaign is active for whole saleday
* ``fromDate`` - date when the campaign begins
* ``untilDate`` - date when the campaign ends 
* ``units`` - an array of [Campaign Unit Row](#campaign-unit-row) objects, showing units where this campaign is used
* ``articles`` - an array of [Campaign Article Row](#campaign-article-row) objects, showing articles included in this campaign

<a name="campaign-unit-row"></a>
### Campaign Unit Row

* ``unitName`` - unit name, operational unit name in Restolution
* ``restaurantID`` - restaurant ID, business unit code in Restolution
* ``businessUnitUUID`` - globally unique identifier for this restaurant

<a name="campaign-article-row"></a>
### Campaign Article Row

* ``articleID`` - sale article number
* ``articleName`` - sale article name
* ``campaignArticleType`` - campaign article type, see [Campaign Article types](#campaign-article-types)
* ``priceGroup`` - number of the price group
* ``quantity`` - quantity of the price group, in 1/1000 parts
* ``maxQuantity`` - maximum allowed quantity of the price group, in 1/1000 parts
* ``price`` - price group total price in cents
* ``articleGroupName`` - article group name this salearticle is belonging to

<a name="available-methods"></a>
## Available Methods

<a name="listrestaurants"></a>
### listRestaurants

For listing all restaurants available to the given API Key.

parameters:

* ``cashRegisterUUIDs`` - optional array of cash register UUIDs, if missing all restaurants will be listed overrides parameter _businessUnitUUIDs_
* ``businessUnitUUIDs`` - optional array of business unit UUIDs, ignored if parameter _cashRegisterUUIDs_ is given
* ``includeArticles`` - flag for including articles in results
* ``includeCustomers`` - flag for including customers in results
* ``includeBaseData`` - flag for including restaurant base data (contact and open hours) in results
* ``includeAllRestaurants`` - flag for including all restaurants with status field shown. If not defined, lists only ACTIVE restaurants.

response:

* ``restaurants`` - array of restaurants, empty if none were found

sample request:

```json
{
    "timestamp" : "2015-09-16T08:58:40.988Z",
    "apiKey" : "user_321681",
    "requestID" : "req_325168426",
    "method" : "listRestaurants",
    "params" : {
        "cashRegisterUUIDs" : [
            "12dad71f-3cb3-4127-a039-81ed6dad2d01"
        ],
        "includeArticles" : true,
        "includeCustomers" : true,
        "includeBaseData" : true
    }
}
```

sample response:

```json
{
  "timestamp": "2015-09-16T08:58:40.988Z",
  "success": true,
  "requestID": "req_325168426",
  "response": {
    "restaurants": [
      {
        "cashRegisterUUID": "12dad71f-3cb3-4127-a039-81ed6dad2d01",
        "businessUnitUUID": "4a67c7a2-bbf6-4130-be16-f4f7b2571d91",
        "restaurantID": "1",
        "name": "S&C Testiravintola",
        "contact": {
          "street": "Linnanpajantie 1",
          "postIndex": "00950",
          "city": "Helsinki",
          "phoneNr": "+358 29 007 4960",
          "wwwAddress": "soft-contact.fi",
          "emailAddress": "support@soft-contact.fi",
          "registrationNr": "2220310-8",
          "companyName": "Soft-Contact Oy"
        },
        "openHours": [
          {
            "Monday": [
              {
                "type": "RESTAURANT",
                "start": "0900",
                "finish": "2100"
              },
              {
                "type": "KITCHEN",
                "start": "0900",
                "finish": "1300"
              },
              {
                "type": "KITCHEN",
                "start": "1400",
                "finish": "1800"
              }
            ]
          },
          {
            "Tuesday": []
          },
          {
            "Wednesday": [
              {
                "type": "RESTAURANT",
                "start": "0000",
                "finish": "2400"
              }
            ]
          },
          {
            "Thursday": []
          },
          {
            "Friday": [
              {
                "type": "RESTAURANT",
                "start": "0900",
                "finish": "2400"
              }
            ]
          },
          {
            "Saturday": [
              {
                "type": "RESTAURANT",
                "start": "0000",
                "finish": "0230"
              }
            ]
          },
          {
            "Sunday": []
          }
        ],
        "maxCustomers": 20,
        "printers": [
          {
            "printerID": "1",
            "name": "Testiravintola lämmin",
            "address": "10.53.2.71",
            "port": "9100",
            "width": 33
          },
          {
            "printerID": "2",
            "name": "Testiravintola kylmä",
            "address": "10.53.2.72",
            "port": "9100",
            "width": 33
          },
          {
            "printerID": "1",
            "name": "Testiravintola baari",
            "address": "10.53.2.73",
            "port": "9100",
            "width": 33
          }
        ],
        "menus": [
          {
            "menuID": 50,
            "name": "Alkuruoka",
            "articles": [
              {
                "articleID": "9001",
                "name": "VIHERSALAATTI",
                "description": "",
                "prices": [
                  {
                    "priceID": "1",
                    "price": 500,
                    "tax": 14
                  }
                ],
                "type": "SALE",
                "printerIDs": [
                  "1"
                ]
              },
              {
                "articleID": "9002",
                "name": "SUOLAKURKKUJA",
                "description": "",
                "prices": [
                  {
                    "priceID": "1",
                    "price": 600,
                    "tax": 14
                  }
                ],
                "type": "SALE",
                "printerIDs": [
                  "1"
                ]
              }
            ]
          },
          {
            "menuID": 51,
            "name": "Pääruoka",
            "articles": [
              {
                "articleID": "9129",
                "name": "PIPPURIPIHVI",
                "description": "",
                "prices": [
                  {
                    "priceID": "1",
                    "price": 1500,
                    "tax": 14
                  }
                ],
                "type": "SALE",
                "includeOptionPrice": true,
                "options": [
                  {
                    "name": "Pottuvalintoja",
                    "minSelections": 1,
                    "maxSelections": 1,
                    "articleIDs": [
                      "9207",
                      "9210"
                    ]
                  }
                ],
                "printerIDs": [
                  "1",
                  "2"
                ]
              },
              {
                "articleID": "9207",
                "name": "VALKOSIPULIPERUNAT",
                "description": "",
                "prices": [
                  {
                    "priceID": "1",
                    "price": 100,
                    "tax": 14
                  }
                ],
                "type": "OPTION"
              },
              {
                "articleID": "9210",
                "name": "PAISTETUT PERUNAT",
                "description": "",
                "prices": [
                  {
                    "priceID": "1",
                    "price": 100,
                    "tax": 14
                  }
                ],
                "type": "OPTION"
              }
            ]
          },
          {
            "menuID": "13",
            "name": "Cocktailit",
            "articles": [
              {
                "articleID": "1301",
                "name": "Drinkki",
                "type": "SALE",
                "restrictedItem": true,
                "includeOptionPrice": false,
                "prices": [
                  {
                    "priceID": "1",
                    "price": 1748,
                    "tax": 24,
                    "priceWithoutTax": 1410
                  }
                ],
                "structure": [
                  {
                    "articleID": "703",
                    "name": "Whisky 1cl",
                    "type": "SALE",
                    "amount": 8000,
		    "prices": [
                      {
                        "priceID": "1",
                        "price": 112,
                        "tax": 24,
                        "priceWithoutTax": 90
                      }
                    ]
                  },
                  {
                    "articleID": "1034",
                    "name": "Liquor 1cl",
                    "type": "SALE",
                    "amount": 750,
		    "prices": [
                      {
                        "priceID": "1",
                        "price": 210,
                        "tax": 24,
                        "priceWithoutTax": 169
                      }
                    ]
                  },
                  {
                    "articleID": "4001",
                    "name": "Drink addition",
                    "type": "SALE",
                    "amount": 1680,
		    "prices": [
                      {
                        "priceID": "1",
                        "price": 100,
                        "tax": 14,
                        "priceWithoutTax": 88
                      }
                    ]
                  },
                  {
                    "articleID": "1066",
                    "name": "Red wine 1cl",
                    "type": "SALE",
                    "amount": 2250,
		    "prices": [
                      {
                        "priceID": "1",
                        "price": 234,
                        "tax": 24,
                        "priceWithoutTax": 189
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        "customers": [
          {
            "customerNumber": "1111",
            "customerName": "Pelle Peloton",
            "customerUUID": "00951a0e-e74e-4a09-82f6-bc36109df2be"
          },
          {
            "customerNumber": "2222",
            "customerName": "Roope Ankka",
            "customerUUID": "0304a579-9630-4ab9-8d9f-12031e7c832f"
          }
        ],
	"units": [
          {
            "unitName": "Bar",
            "unitUUID": "74df21c3-b4b9-405c-8f21-0909986e0d78"
          },
          {
            "unitName": "Dining room",
            "unitUUID": "68884762-1d63-4c4f-81b1-dda39f69c643"
          }
	]  
      }
    ]
  }
}
```

<a name="getreceipts"></a>
### getReceipts

For getting sales from back office. If a request takes long time, please try a shorter period or fewer business units. It is also recommended to use a unique _requestID_ per request to make it easier to combine the results from multiple requests.

<b>Note: The RESTO JSON API is not intended for bulk receipt transfer, if the goal is to get all historic receipts then please consult with our support/sales for alternative options.</b>

parameters:

* ``restaurantIDs`` - array containing restaurantIDs, ignored if parameter _businessUnitUUIDs_ is given
* ``businessUnitUUIDs`` - array containing business unit UUIDs, overrides parameter _restaurantIDs_
* ``salesReadFromDate`` - include sales read to back office since given date,
        if not given, sales read to back office since last call to ``getReceipts`` will be returned
* ``receiptTimeFromDate`` - include receipts with timestamp equal or later than given date. Overrides ``salesReadFromDate``.
* ``receiptTimeUntilDate`` - include receipts with timestamp equal or older than given date
* ``includeSaleRows`` - include sales receipt rows in the results
* ``includePaymentRows`` - include payment receipt rows in the results
* ``invoiceReceiptsOnly`` - true / false to include only invoice receipts
* ``reconciliatedDatesOnly`` - true / false if results should include only reconciliated dates. Can be used only when ``invoiceReceiptsOnly`` = true.
* ``includeRowComments`` - true / false if row comments should be included (included by default if ``invoiceReceiptsOnly`` = true)
* ``includeAccountingInfo`` - true / false if Bookkeeping account codes should be included on sale and payment rows (also requires either ``includeSaleRows`` or ``includePaymentRows``)

Note 1: If no date parameters are given, the default value for ``salesReadFromDate`` will be used. Default value is kept by Restolution.

Note 2: Use receipt date parameters when data from specified dates should be exported.

Note 3: If only reconciliated dates should be fetched, set ``reconciliatedDatesOnly`` to ``true`` without date parameters. Restolution will provide reconciliated data since previous data export.

Note 4: Reconciliated data can't be exported if date is not reconciliated.

response:

* ``receipts`` - array of receipts containing arrays of sale and payment rows

sample request:

```json
{
    "apiKey":"user_321681",
    "timestamp":"2015-09-16T08:58:40.988Z",
    "requestID":"req_325168426",
    "method":"getReceipts",
    "params":{
        "restaurantIDs":[
            "101","102"
        ],
        "includeSaleRows":true,
        "includePaymentRows":true,
        "includeRowComments":true,
	"includeAccountingInfo:true
    }
}
```

sample response:

```json
{
    "timestamp":"2015-09-16T08:58:40.988Z",
    "success":true,
    "requestID":"req_325168426",
    "response":{
        "receipts":[
            {
                "receiptID":"123456",
                "receiptUUID":"a2ba12dd-3adc-431d-ae11-46f6a47ce040",
                "sourceHash":"ebae5a26f8f1e9b7757fc301c3641739",
                "receiptType":"NORMAL",
                "timestamp":"2015-09-16T08:58:40",
                "cashRegisterUUID":"12dad71f-3cb3-4127-a039-81ed6dad2d01",
                "businessUnitUUID" : "4a67c7a2-bbf6-4130-be16-f4f7b2571d91",
                "cashRegisterName":"Baari kassa 1",
                "customerNumber":"1111",
                "customerName":"Earl of Grantham",
                "customerUUID":"012531ec-ebc1-432d-96c7-2367994c1ccb",
                "cardNumber":"1234567",
                "ourReference":"Last time we offered free vodka",
                "yourReference":"Best pikkujoulut ever!",
                "restaurantID":"101",
                "restaurantName":"Kulman Kuppila",
                "customerQuantity":1,
                "freeText":"Pizzaan saa laittaa valkosipulia",
		"memoInfo":"Tänne voi laittaa muistion",
                "quickInvoice":false,
                "tableCode":"100",
                "receiptRows":[
                    {
                        "articleID":"123",
                        "articleName":"Pizza 3lla täytteellä",
                        "additionalArticleName":"Peltileipä 3lla täytteellä",
                        "priceID":"1",
                        "price":1200,
                        "quantity":1000,
                        "amount":1080,
                        "tax":14,
                        "timestamp":"2015-09-16T08:58:40",
                        "unitName":"Baari",
                        "clerkNumber":"111",
                        "clerkName":"Thomas Barrow",
                        "mainGroupNumber":"3",
                        "mainGroupName":"Ruoka",
                        "articleGroupNumber":"533",
                        "articleGroupName":"Pizza",
                        "rowComment":"tärkeä lisätieto",
                        "discounts":[
                            {
                                "method":"PERCENT",
                                "name":"10% Alennus",
                                "code":"ALE10",
                                "value":10,
                                "amount":120
                            }
                        ],
			"accountCode":"1234"
                    },
                    {
                        "articleID":"200",
                        "articleName":"Cola 0,5l",
                        "additionalArticleName": "Limsa 0,5l",
                        "priceID":"1",
                        "price":600,
                        "quantity":1000,
                        "amount":540,
                        "tax":14,
                        "timestamp":"2015-09-16T08:58:40",
                        "unitName":"Baari",
                        "clerkNumber":"222",
                        "clerkName":"Daisy Mason",
                        "mainGroupNumber":"4",
                        "mainGroupName":"Juomat",
                        "articleGroupNumber":"200",
                        "articleGroupName":"Limsat",
                        "discounts":[
                            {
                                "method":"PERCENT",
                                "name":"10% Alennus",
                                "code":"ALE10",
                                "value":10,
                                "amount":60
                            }
                        ],
			"accountCode": "1234"
                    },
                    {
                        "articleID": "88",
                        "articleName": "Teatime Collins",
                        "additionalArticleName": "Teatime Collins",
                        "priceID": "1",
                        "price": 0,
                        "quantity": 1000,
                        "amount": 0,
                        "tax": 24,
                        "timestamp": "2017-10-10T11:37:47",
                        "unitName": "Baari",
                        "clerkNumber":"222",
                        "clerkName":"Daisy Mason",
                        "mainGroupNumber": "1",
                        "mainGroupName": "Alko",
                        "articleGroupNumber": "10",
                        "articleGroupName": "Drinkit",
                        "saleID": 1019119287,
			"accountCode": "1234"
                    },
                    {
                        "articleID": "85",
                        "articleName": "Chase rhubard1",
                        "additionalArticleName": "Raparperilikööri",
                        "priceID": "1",
                        "price": 700,
                        "quantity": 250,
                        "amount": 175,
                        "tax": 24,
                        "timestamp": "2017-10-10T11:37:47",
                        "unitName": "Baari",
                        "clerkNumber":"222",
                        "clerkName":"Daisy Mason",
                        "mainGroupNumber": "1",
                        "mainGroupName": "Alko",
                        "articleGroupNumber": "14",
                        "articleGroupName": "Katkerot",
                        "parentID": 1019119287,
			"accountCode": "1234"
                    },
                    {
                        "articleID": "86",
                        "articleName": "Tanqueray",
                        "additionalArticleName": "Giniä",
                        "priceID": "1",
                        "price": 900,
                        "quantity": 750,
                        "amount": 675,
                        "tax": 24,
                        "timestamp": "2017-10-10T11:37:47",
                        "unitName": "Baari",
                        "clerkNumber":"222",
                        "clerkName":"Daisy Mason",
                        "mainGroupNumber": "1",
                        "mainGroupName": "Alko",
                        "articleGroupNumber": "14",
                        "articleGroupName": "Katkerot",
                        "parentID": 1019119287,
			"accountCode": "1234"
                    },
                    {
                        "articleID": "87",
                        "articleName": "Cocktaillisä 2,00",
                        "additionalArticleName": "Cocktaillisä 2,00",
                        "priceID": "1",
                        "price": 200,
                        "quantity": 2000,
                        "amount": 400,
                        "tax": 14,
                        "timestamp": "2017-10-10T11:37:47",
                        "unitName": "Baari",
                        "clerkNumber":"222",
                        "clerkName":"Daisy Mason",
                        "mainGroupNumber": "4",
                        "mainGroupName": "Vesi",
                        "articleGroupNumber": "62",
                        "articleGroupName": "Vesi / mehut",
                        "parentID": 1019119287,
			"accountCode": "1234"
                    }
                ],
                "paymentRows":[
                    {
                        "timestamp":"2015-09-16T08:58:35",
                        "paymentCode":"CARD",
                        "paymentName":"Kortti",
                        "quantity":1000,
                        "amount":1620,
			"accountCode":"4567"
                    }
                ]
            }
        ]
    }
}
```

<a name="getbookkeepingrows"></a>
### getBookkeepingRows

For getting bookkeeping rows from back office.

parameters:

* ``costCentreCodes`` - array containing cost centre codes
* ``salesReadFromDate`` - include sales read to back office since given date
        if not given, sales read to back office since last call to ``getBookkeepingRows`` will be returned
* ``receiptTimeFromDate`` - include receipts with timestamp equal or later than given date. Overrides ``salesReadFromDate``
* ``receiptTimeUntilDate`` - include receipts with timestamp equal or older than given date
* ``reconciliatedDatesOnly`` - true / false if results should include only reconciliated dates
* ``includeStorageData`` - true / false if results should include storage changes. Storage data contains transactions from sales and different storage jobs
* ``excludeSalesData`` - true / false if sales data should be excluded from results

response:

* ``bookkeepingRows`` - array of bookkeeping rows

sample request:

```json
{
    "apiKey":"user_321681",
    "timestamp":"2015-09-16T08:58:40.988Z",
    "requestID":"req_325168426",
    "method":"getBookkeepingRows",
    "params":{
        "costCentreCodes":[
            "10", "20", "30"
        ],
        "receiptTimeFromDate":"2015-08-01T05:00:00",
        "receiptTimeUntilDate":"2015-08-31T05:00:00",
        "reconciliatedDatesOnly":true
    }
}
```

sample response:

```json
{
    "timestamp":"2015-09-16T08:58:40.988Z",
    "success":true,
    "requestID":"req_325168426",
    "response":{
        "bookkeepingRows":[
            {
                "saleDate":"2015-08-01",
                "companyCode":"1",
                "costCentreCode":"10",
                "accountCode":"3010",
                "code":"22",
                "amount":19230,
                "netAmount":16868,
                "vatAmount":2362,
                "vatCode":"1"
            },
            {
                "saleDate":"2015-08-01",
                "companyCode":"2",
                "costCentreCode":"20",
                "accountCode":"3020",
                "code":"33",
                "amount":43320,
                "netAmount":38000,
                "vatAmount":5320,
                "vatCode":"1"
            }
        ]
    }
}
```

<a name="savereceipts"></a>
### saveReceipts

For saving a batch of fulfilled order receipts to back office.

parameters:

* ``receipts`` - array of Receipt objects

response:

* ``savedReceipts`` - array of objects containing unique ``receiptID``, ``receiptsUUID`` and ``timestamp`` for each saved receipt

sample request:

```json
{
    "apiKey":"user_321681",
    "timestamp":"2015-09-16T08:58:40.988Z",
    "requestID":"req_325168426",
    "method":"saveReceipts",
    "params":{
        "receipts":[
            {
                "receiptID":"123456",
                "receiptUUID":"a2ba12dd-3adc-431d-ae11-46f6a47ce040",
                "timestamp":"2015-09-16T08:58:40",
                "cashRegisterUUID":"12dad71f-3cb3-4127-a039-81ed6dad2d01",
                "customerNumber":"1111",
                "customerUUID":"00ecd260-3a52-4aa6-aecc-f63d10cf913a",
                "cardNumber":"1234567",
                "ourReference":"Last time we offer free vodka",
                "yourReference":"Best pikkujoulut ever!",
                "receiptRows":[
                    {
                        "articleID":"123",
                        "priceID":"2",
                        "quantity":2000,
                        "amount":1200,
                        "tax":14
                    },
                    {
                        "articleID":"666",
                        "priceID":"1",
                        "quantity":1000,
                        "amount":1400
                    }
                ],
                "paymentRows":[
                    {
                        "timestamp":"2015-09-16T08:58:35",
                        "paymentCode":"PREPAID",
                        "amount":2600,
                        "tip":100
                    }
                ]
            }
        ]
    }
}
```

sample response:

```json
{
    "timestamp":"2015-09-16T08:58:40.988Z",
    "success":true,
    "requestID":"req_325168426",
    "response":{
        "savedReceipts":[
            {
                "receiptID": "123456",
                "receiptUUID": "cfb62e72-33ea-4152-a40c-ce7c30c147d0",
                "timestamp": "2015-09-16T08:58:40"
            }
        ]
    }
}
```

<a name="listcustomers"></a>
### listCustomers

For listing customers available to the given API Key. 
If several Restolution clients share the same API Key, customers from all clients will be listed. Customers with same number will be listed as separate objects.

See also [Customer](#customer).

parameters:

* ``restaurantIDs`` - array of Restaurant IDs whose customers to include
* ``businessUnitUUIDs`` - array containing business unit UUIDs whose customers to include, overrides parameter restaurantIDs
* ``customerNumbers`` - array of customer numbers to include
* ``customerUUIDs`` - array of customer UUIDs to include, overrides parameter customerNumbers
* ``includeContact`` - flag to indicate whether customer contact information should be included
* ``activeOnly`` - flag to indicate whether only active customers should be included
* ``modifiedSince`` - include only customers modified since this timestamp

response:

* ``customers`` - array of Customer objects

sample request:

```json
{
    "timestamp":"2015-09-16T08:58:40.988Z",
    "apiKey":"user_321681",
    "requestID":"req_325168426",
    "method":"listCustomers",
    "params":{
        "customerNumbers":[
            "1", "4", "8"
        ],
        "includeContact":true,
        "modifiedSince":"2015-01-01T03:00:00.000Z"
    }
}
```

sample response:

```json
{
    "timestamp": "2015-09-16T08:58:40.988Z",
    "success": true,
    "requestID": "req_325168426",
    "response": {
        "customers": [
            {
                "customerNumber": "1",
                "customerName": "CUBA IMPORT EXPORT",
                "customerUUID": "a1ad841e-b7f6-472d-b795-95d075929ef7",
				            "clientName": "S&C Testiravintola",
                "comment": "testikommentti 200",
                "allowInvoicing": true,
                "referenceNumber": "111",
                "type": "LUNCH_AND_LOYALTY",
                "additionalName": "testi testi testi",
                "contactPerson": "xxxxx",
                "nameSendToCashRegister": "C.I.E black market",
                "allowCardCrediting": true,
                "invoiceMethod": "AUTO_WITH_CONFIRMATION",
                "invoicePeriod": "MONTHLY",
                "invoiceContent": "ALL_RECEIPTS_IN_SAME",
                "subventionsOnceAMonth": true,
                "active": true
                "contact": {
                    "emailAddress": "email@email.com",
                    "street": "Salakuljettajankatu 8",
                    "city": "Hki",
                    "postIndex": "00001",
                    "mobilePhoneNr": "999999",
                    "phoneNr": "000000"
                }
            },
            {
                "customerNumber": "4",
                "customerName": "MAKKE OY",
                "customerUUID": "35c21d34-e5c1-45b0-b6b8-a0db9f645fb4",
				            "clientName": "S&C Testiravintola",
                "allowInvoicing": true,
                "referenceNumber": "123",
                "type": "LUNCH",
                "additionalName": "MAKKE",
                "contactPerson": "MAKKE",
                "nameSendToCashRegister": "MAKKE",
                "allowCardCrediting": true,
                "invoiceMethod": "MANUAL",
                "invoicePeriod": "MONTHLY",
                "invoiceContent": "ALL_RECEIPTS_IN_SAME",
                "subventionsOnceAMonth": false,
                "active": true
            },
            {
                "customerNumber": "8",
                "customerName": "VAKIO SÄÄTÄJÄT KY",
                "customerUUID": "a21cedb0-5a07-4edd-951b-06e960f44100",
				            "clientName": "Il Pastarito",
                "allowInvoicing": false,
                "referenceNumber": "124",
                "type": "LUNCH_AND_LOYALTY",
                "allowCardCrediting": true,
                "invoiceMethod": "MANUAL",
                "invoicePeriod": "MONTHLY",
                "invoiceContent": "ALL_RECEIPTS_IN_SAME",
                "subventionsOnceAMonth": false,
                "active": true
            }
        ]
    }
}
```

<a name="importcustomers"></a>
### importCustomers

For importing new and editing existing customers. 
If several Restolution clients share the same API Key, the same customers will be imported identically to all clients.
See also [Customer](#customer).

parameters:

* ``customers`` - array of Customer objects
* ``clientNames`` - array of Client names of clients where the customers should be imported. Note: If this parameter is used, an imported customer can still have the clientName field to limit import of that particular customer to only one client, but the value has to be one of the clientNames values, otherwise an error will be returned.

response:

A "savedCustomers" object that contains the following fields:

* ``customers`` - nr of customers in request
* ``added`` - nr of new customers added
* ``updated`` - nr of existing customers updated
* ``clients`` - nr of clients affected

sample request:

```json
{
    "timestamp": "2015-09-16T08:58:40.988Z",
    "apiKey": "user_321681",
    "requestID": "req_325168426",
    "method": "importCustomers",
    "params": {
        "clientNames" : ["S&C Testiravintola","Il Pastarito"],
        "customers": [
            {
                "customerNumber": "1",
                "customerName": "CUBA IMPORT EXPORT",
                "comment": "testikommentti 200",
                "allowInvoicing": true,
                "referencenumber": "111",
                "type": "LUNCH_AND_LOYALTY",
                "additionalName": "testi testi testi",
                "contactPerson": "xxxxx",
                "nameSendToCashRegister": "C.I.E black market",
                "allowCardCrediting": true,
                "invoiceMethod": "AUTO_WITH_CONFIRMATION",
                "invoicePeriod": "MONTHLY",
                "invoiceContent": "ALL_RECEIPTS_IN_SAME",
                "subventionsOnceAMonth": true,
                "active": true,
                "contact": {
                    "emailAddress": "email@email.com",
                    "street": "Salakuljettajankatu 8",
                    "city": "Hki",
                    "postIndex": "00001",
                    "mobilePhoneNr": "999999",
                    "phoneNr": "000000"
                },
                "restaurantIDs":[
                    "101","102"
                ]
            },
            {
                "customerNumber": "4",
                "customerName": "MAKKE OY",
                "allowInvoicing": true,
                "referenceNumber": "123",
                "type": "LUNCH",
                "additionalName": "MAKKE",
                "contactPerson": "MAKKE",
                "nameSendToCashRegister": "MAKKE",
                "allowCardCrediting": true,
                "invoiceMethod": "MANUAL",
                "invoicePeriod": "MONTHLY",
                "invoiceContent": "ALL_RECEIPTS_IN_SAME",
                "subventionsOnceAMonth": false,
                "active": true,
                "businessUnitUUIDs":[
                     "4a67c7a2-bbf6-4130-be16-f4f7b2571d91", "02462343-eeca-4bec-89cf-be411e98ce01"
                ]
            },
            {
                "customerNumber": "8",
                "customerName": "VAKIO SÄÄTÄJÄT KY",
                "clientName":"Il Pastarito",
                "allowInvoicing": false,
                "referenceNumber": "124",
                "type": "LUNCH_AND_LOYALTY",
                "allowCardCrediting": true,
                "invoiceMethod": "MANUAL",
                "invoicePeriod": "MONTHLY",
                "invoiceContent": "ALL_RECEIPTS_IN_SAME",
                "subventionsOnceAMonth": false,
                "active": false
            }
        ]
    }
}
```

sample response:

```json
{
    "timestamp": "2015-09-16T08:58:40.988Z",
    "success": true,
    "requestID": "req_325168426",
    "response": {
        "savedCustomers": {
            "customers": 3,
            "added": 1,
            "updated": 2,
            "clients": 2
        }
    }
}
```

<a name="listcards"></a>
### listCards

For listing customer cards available to the given API Key.
If no parameters are given, all cards available to the API key are listed.
If several Restolution clients share the same API Key, customer cards from all clients will be listed as long as any customer card with same number is identical between clients. If ambiguous cards are found, the method will fail with an error message.
See also [Card](#card).

parameters:

* ``customerNumbers`` - array of customer numbers whose cards to include
* ``cardNumbers`` - array of card numbers to include
* ``includeInactive`` - include not active cards in the results

response:

* ``cards`` - array of [Card](#card) objects

sample request:

```json
{
  "timestamp": "2015-09-16T08:58:40.988Z",
  "apiKey": "user_321681",
  "requestID": "req_325168426",
  "method": "listCards",
  "params": {
    "customerNumbers": [
      "1",
      "4",
      "8"
    ],
    "cardNumbers": [
      "111122223333",
      "444455556666"
    ],
    "includeInactive": false
  }
}
```

sample response:

```json
{
  "timestamp": "2015-09-16T08:58:40.988Z",
  "success": true,
  "requestID": "req_325168426",
  "response": {
    "cards": [
      {
        "cardNumber": "111122223333",
        "customerNumber": "1",
        "type": "LOYALTY",
        "active": true,
        "validUntil": "2018-10-16T04:59:59",
        "holderName": "Mia Mallikas",
        "personCode": "1234567",
        "department": "1122",
        "departmentName": "some department",
        "accountCode": "1234567",
        "workHoursPerWeek": 40
      },
      {
        "cardNumber": "222233334444",
        "customerNumber": "4",
        "type": "LUNCH",
        "active": true,
        "validUntil": "2018-12-22T04:59:59",
        "holderName": "Keijo Korttelin",
        "personCode": "2345678",
        "department": "1122",
        "departmentName": "some department",
        "accountCode": "1234567",
        "workHoursPerWeek": 40
      }
    ]
  }
}
```

<a name="importcards"></a>
### importCards

For importing new and editing existing customer cards. If several Restolution clients share the same API Key, the same customer cards will be imported identically to all clients.
See also [Card](#card).

parameters:

* ``cards`` - array of [Card](#card) objects.

response:

A "savedCards" object that contains the following fields:

* ``cards`` - nr of cards in request
* ``added`` - nr of new cards added
* ``updated`` - nr existing cards updated
* ``customers`` - nr of customers affected
* ``clients`` - nr of clients affected

sample request:

```json
{
  "timestamp": "2015-09-16T08:58:40.988Z",
  "apiKey": "user_321681",
  "requestID": "req_325168426",
  "method": "importCards",
  "params": {
    "cards": [
      {
        "cardNumber": "111122223333",
        "customerNumber": "1",
        "type": "LOYALTY",
        "active": true,
        "validUntil": "2018-10-16T04:59:59",
        "holderName": "Mia Mallikas",
        "personCode": "1234567",
        "department": "1122",
        "departmentName": "some department",
        "accountCode": "1234567",
        "workHoursPerWeek": 40
      },
      {
        "cardNumber": "222233334443",
        "customerNumber": "4",
        "type": "LUNCH",
        "active": true,
        "validUntil": "2018-12-22T04:59:59",
        "holderName": "Keijo Korttelin",
        "personCode": "2345678",
        "originalNumber": "222233334444",
        "department": "1122",
        "departmentName": "some department",
        "accountCode": "1234567",
        "workHoursPerWeek": 40
      }
    ]
  }
}
```

sample response:

```json
{
  "timestamp": "2015-09-16T08:58:40.988Z",
  "success": true,
  "requestID": "req_325168426",
  "response": {
    "savedCards": {
      "cards": 2,
      "added": 1,
      "updated": 1,
      "customers": 2,
      "clients": 1
    }
  }
}
```
<a name="listCampaigns"></a>
### listCampaigns

For listing campaigns available to the given API Key by given from-to time filter:
* (1) if no parameters are given, all campaigns available to the API key are listed;
* (2) if both parameters are set and equals then campaigns active for that provided time are returned;
* (3) if providing only from time filter then campaigns active after given time (or equal) are returned;
* (4) if providing only until time filter then campaigns active before given time (or equal) are returned;
* (5) otherwise active campaigns for given from-to time are returned.

If several Restolution clients share the same API Key, campaigns from all clients will be listed.
See also [Campaign](#campaign).

parameters:
* ``campaignFromDate`` - for filtering campaign ``fromDate`` 
* ``campaignUntilDate`` - for filtering campaign ``untilDate`` 

response:

* ``campaigns`` - array of [Campaign](#campaign) objects
* ``campaignsActiveForDate`` - returned in case of (2), showing time for which active campaigns are returned  
* ``campaignsFromDate`` - returned in case of (3),(4),(5), showing used from time for filtering 
* ``campaignsUntilDate`` - returned in case of (3),(4),(5), showing used to time for filtering

sample request:

```json
{
	"timestamp": "2017-03-10T14:41:40Z",
	"apiKey": "user_321681",
	"requestID": "req_3251234234",
	"method": "listCampaigns",
	"params": {
		"campaignFromDate": "2020-10-05T00:00:00Z",
		"campaignUntilDate": "2020-10-05T00:00:00Z"
	}
}
```

sample response:

```json
{
	"success": true,
	"timestamp": "2020-10-15T12:27:02.509Z",
	"requestID": "req_3251234234",
	"response": [
		{
			"campaigns": [
				{
					"goal": "Myydä paljon",
					"comment": "No comments",
					"endTime": "23:00",
					"articles": [
						{
							"articleName": "TOTIVESI",
							"price": 500,
							"quantity": 3000,
							"articleID": 9407,
							"priceGroup": 1,
							"maxQuantity": 1000,
							"articleGroupName": "Vesi / mehut",
							"campaignArticleType": "CAMPAIGN"
						},
						{
							"articleName": "VESIKANNU",
							"price": 500,
							"quantity": 3000,
							"articleID": 9426,
							"priceGroup": 1,
							"maxQuantity": 1000,
							"articleGroupName": "Vesi / mehut",
							"campaignArticleType": "CAMPAIGN"
						},
						{
							"articleName": "VESIPULLO",
							"price": 500,
							"quantity": 3000,
							"articleID": 6026,
							"priceGroup": 1,
							"maxQuantity": 1000,
							"articleGroupName": "Vesi / mehut",
							"campaignArticleType": "CAMPAIGN"
						}
					],
					"fromDate": "2017-03-28T05:00:00+03:00",
					"startTime": "03:00",
					"untilDate": "2025-04-01T04:59:59+03:00",
					"weekdayFri": true,
					"weekdayMon": true,
					"weekdaySat": true,
					"weekdaySun": true,
					"weekdayThu": true,
					"weekdayTue": true,
					"weekdayWed": true,
					"campaignName": "juomia",
					"campaignType": "CUSTOM_PRICE",
					"campaignSubType": "SET_AMOUNT",
					"operationalUnits": [
						{
							"unitName": "SC TEST",
							"restaurantID": "1",
							"businessUnitUUID": "dc06fe0e-b68b-4f66-a48e-2adc0ce56ffa"
						}
					]
				}
			],
			"campaignsActiveForDate": "2020-10-05T00:00:00+03:00"
		}
	]
}
```

<a name="receipt-types"></a>
## Receipt types

* NORMAL
    Normal sales receipt.

* VOID
    Deduction (void) receipt.

* MGR
    Manager receipt.

* RECONCILIATION
    Reconciliation receipt.

* BACKOFFICE_RECONCILIATION
    Reconciliation receipt created by reconciliation verification business logic in back office.

* BACKOFFICE_SALE
    Receipts that are made in back office.

* COMMISSION
    Subvention commission receipt.

* BALANCE
    Customer balance receipts from cash register.

* SUBVENTION
    Subventions receipt.

<a name="discount-methods"></a>
## Discount methods

* PERCENTAGE
    Percentage discount, discount value will be discount percentage * 100. Percentage is applied on sum including VAT.

* SUM
    Sum discount, discount value is discount sum in cents including VAT.

<a name="customer-types"></a>
## Customer types

* LUNCH
    Lunch customer

* LOYALTY
    Loyalty customer

* LUNCH_AND_LOYALTY
    Lunch and loyalty customer

* CUSTOMER_BALANCE
    Customer balance customer

* CUSTOMER_BALANCE_GIFT_CARD
    Gift voucher customer balance customer

<a name="customer-invoicing-methods"></a>
## Customer invoicing methods

* MANUAL
    Invoices are generated manually

* AUTO_WITHOUT_CONFIRMATION
    Invoices are generated automatically, but not confirmed

* AUTO_WITH_CONFIRMATION
    Invoices are generated and confirmed automatically

<a name="customer-invoicing-periods"></a>
## Customer invoicing periods

* MONTHLY
    Invoices generated once a month

* HALF_MONTHLY
    Invoices generated once every 2 weeks

* WEEKLY
    Invoices generated every week

* DAILY
    Invoices generated every day

<a name="customer-invoice-contents"></a>
## Customer invoice contents

* ALL_RECEIPTS_IN_SAME
    Receipts to same invoice per costcentre

* INVOICE_PER_RECEIPT
    Every receipt to separate invoice

* ALL_RECEIPTS_IN_SAME_FOR_ALL
    For subvention/commission receipts: All receipts are forced to same invoice over all costcentres
    For regular receipts: same as ALL_RECEIPTS_IN_SAME
    
<a name="card-types"></a>
## Card types

* LOYALTY
    Loyalty customer card

* LUNCH
    Lunch card

* LUNCH_MULTI
    Multi lunch card

<a name="open-hour-types"></a>
## Open hour types

* RESTAURANT
    Restaurant open hours

* KITCHEN
    Kitchen open hours

<a name="campaign-types"></a>
## Campaign types

* CUSTOM_PRICE
    Special together price: 
    When all articles of this campaign are sold together
    they will use the prices defined in this campaign.

* RECOMMENDATION
    Recommendation:
    When article(s) of this campaign are sold, the recommendation articles
    of this campaign are presented to clerk in a list from which they can be
    recommended to client and added to receipt.
    All articles can be assigned custom prices.

* CHEAPEST_FOR_FREE
    Cheapest for free:
    When all articles of this campaign are sold together
    the client will get the cheapest one for free.
    
* FREE_ARTICLE
    Free article:
    When all articles of this campaign are sold together
    a defined free article is added to the receipt.

* ADDITIONAL_SALE
    Additional sale:
    When the triggering articles are sold in specified amounts
    a defined additional sale article will be added to the receipt with current price level.

* REPORT
    Report:
    This campaign is for reporting purposes only.
    
<a name="campaign-sub-types"></a>
## Campaign Sub types

* SET_AMOUNT
    Set amount indicates that campaign is triggered only for set amount of sold articles (of a price group).

* MAX_AMOUNT
    Max amount indicated that campaign is allowed for a defined maximum amount of articles (of a price group).

* SET_AMOUNT_PER_ARTICLE
    Set amount indicates that campaign is triggered only for set amount of same sold articles (of a price group).

* DESCENDING_PRICE
    Multiple set prices per article triggered when the set threshold article amount is sold.
    For example:
    * One slice: 4,90€
    * Two slices: 8,90€ so it is 4,45€ per slice
    * Three to seven slices: 12,90€, = 4,30€ per slice
    * Eight or more slices: 31,90 = 3,99€ per slice

<a name="campaign-article-types"></a>
## Campaign Article types

* CAMPAIGN
    Article that belongs to campaign.
    Used with campaign types: CUSTOM_PRICE, RECOMMENDATION,
    CHEAPEST_FOR_FREE and REPORT.

* RECOMMENDATION
    Article that can be recommended in a campaign.
    Used in campaign type RECOMMENDATION.
     
* FREE
    Free article that can be added to receipt in a campaign.
    Used in campaign type FREE_ARTICLE.
         
* ADDITIONAL_SALE
    Additional sale article that can be added to receipt in a campaign.
    Used in campaign type ADDITIONAL_SALE.
     
<a name="version-history"></a>
## Version history

| Date        | Author                            | Summary                      |
| ----------- | --------------------------------- | ---------------------------- |
| 17.4.2018  | mats.antell@soft-contact.fi        | Initial version              |
| 18.4.2018  | mats.antell@soft-contact.fi        | Added Receipt.quickInvoice   |
| 3.5.2018   | mats.antell@soft-contact.fi        | Added Card and related methods |
| 4.5.2018   | mats.antell@soft-contact.fi        | Added Customer.restaurantIDs to importCustomers |
| 2.1.2019   | mats.antell@soft-contact.fi        | Modified Restaurants.openHours |
| 11.1.2019  | mats.antell@soft-contact.fi        | Added Receipt.sourceHash and 2 new parameters to getBookkeepingRows|
| 30.1.2019  | mats.antell@soft-contact.fi        | Added ReceiptRow.additionalArticleName |
| 14.3.2019  | mats.antell@soft-contact.fi        | Added businessUnitUUID to Restaurant and Receipt |
| 20.3.2019  | mats.antell@soft-contact.fi        | Added registrationNr and companyName to Restaurant |
| 27.3.2019  | mats.antell@soft-contact.fi        | Added customerUUID, removed customer import/export merging |
| 28.10.2019 | ilkka.hyvarinen@kassamagneetti.fi  | Added status, includeAllRestaurants to Restaurant and listRestaurants |
| 14.10.2020   | tt@soft-contact.fi       | Added Campaign and related methods |
| 31.08.2021 | mats.antell@kassamagneetti.fi      | Added Article.structure and Article.amount |  
| 14.11.2022 | mats.antell@restolution.fi         | Added Restaurant.units and Unit | 
