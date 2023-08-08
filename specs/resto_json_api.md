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
    + [Open Hours](#open-hours)
    + [Open Hour](#open-hour)
    + [Menu](#menu)
    + [Article](#article)
    + [Price](#price)
    + [Article Option](#article-option)
    + [Receipt](#receipt)
    + [Article Options / Chosen Options](#article-options---chosen-options)
    + [Extended Article](#extendedarticle)
    + [Extended Article (import)](#extendedarticle_import)
    + [Content Article](#contentarticle)
    + [Price List](#pricelist)
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
    + [Delivery Note](#deliverynote)
    + [Delivery Note Row](#deliverynoterow)
    + [Transfer](#transfer)
    + [Transfer Row](#transferrow)
    + [Wastage](#wastage)
    + [Wastage Row](#wastagerow)
    + [Inventory](#inventory)
    + [Inventory Row](#inventoryrow)
    + [Storage Value](#storagevalue)
    + [Employee](#employee)
    + [Time Tracking](#timetracking)
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
    + [getDeliveryNotes](#getdeliverynotes)
    + [getTransfers](#gettransfers)
    + [getWastages](#getwastages)
    + [getInventories](#getinventories)
    + [getArticles](#getarticles)
    + [importArticles](#importarticles)
    + [getStorageValues](#getstoragevalues)
    + [listEmployees](#listemployees)
    + [importEmployees](#importemployees)
    + [importTimeTrackings](#importtimetrackings)
    
  * [Receipt types](#receipt-types)
  * [Discount methods](#discount-methods)
  * [Customer types](#customer-types)
  * [Customer invoicing methods](#customer-invoicing-methods)
  * [Customer invoicing periods](#customer-invoicing-periods)
  * [Customer invoice contents](#customer-invoice-contents)
  * [Card types](#card-types)
  * [Version history](#version-history)
  * [Article main type](#article_maintype)
  * [Article sub type](#article_subtype)
  * [Article link price type](#article_link_pricetype)
  * [Employee types](#employee-types)


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
* ``cardCustomData1`` - optional custom data, used in "getReceipts" for RestoCoin cards
* ``cardCustomData2`` - optional custom data, used in "getReceipts" for RestoCoin cards
* ``cardCustomData3`` - optional custom data, used in "getReceipts" for RestoCoin cards
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

<a name="extendedarticle"></a>
### Extended Article

The articles returned by the ``getArticles``  method are objects of  ``ExtendedArticle`` and contain more fields than the ``Article`` object returned in the ``getRestaurants`` method. 

* ``articleUUID`` -  globally unique identifier for this article (a type 4 UUID as specified by RFC 4122)
* ``articleName`` - article name
* ``clientUUID`` - globally unique identifierof the Restolution client that this article belongs to (a type 4 UUID as specified by RFC 4122)
* ``operationGroupID`` - operation group ID of the operation group this article belongs to
* ``operationGroupName`` - operation group name of the operation group this article belongs to
* ``modifiedDate`` - when this article was last modified
* ``mainType`` - [Article Main Type](#article_maintype) of this article
* ``subType`` - [Article Sub Type](#article_subtype) of this article
* ``status`` - the status of this article, can be one of "ACTIVE", "DELETED", "DESIGN"
* ``mainGroupID`` - main group ID of this article
* ``mainGroupName`` - main group name of this article
* ``articleGroupID`` - article group ID of this article
* ``articleGroupName`` - article group name of this article
* ``saleArticleID`` - sale article ID of this article if it is a sale article
* ``storageArticleID`` - storage article ID of this article if it is a storage article
* ``recipeArticleID`` - recipe article ID of this article if it is a recipe article
* ``usageUnit`` - usage unit that this storage article is used in when contained in other articles. E.g. a centilitre, CL.
* ``usageUnitInSIUnits`` - usage unit in SI units, e.g. how many centilitres in a litre, in 1/1000 parts.
* ``usageUnitsInBaseUnit`` - usage units in base unit, how many usage units fit into one base unit, e.g. 70 centilitres in one bottle, in 1/1000 parts.
* ``baseUnit`` - base unit that is used as a base for storage amounts, e.g. a bottle, BTL.
* ``baseUnitInSIUnits`` - base unit in SI units, e.g. how many litres in a bottle. Note that this defaults to 1 for all units that can have different sizes, in 1/1000 parts.
* ``baseUnitsInDeliveryUnit`` - base units in delivery unit, e.g. 20 bottles in a box.
* ``deliveryUnit`` - delivery unit that the article arrives to the storage in, e.g. a box.
* ``deliveryUnitInSIUnits`` - delivery unit in SI units. Note that this defaults to 1 for all units that can have different sizes, in 1/1000 parts.
* ``recipeQuantity`` - the unit quantity of the recipe article that is to be used in other articles
* ``recipeUnit`` - the unit of the receipe article, e.g. millilitres, ML.
* ``saleTax`` - Sale tax percentage applied to the sale of this article. Given as a whole number, e.g 24% is given as 24.
* ``purchaseTax`` - Purchase tax percentage applied to the the purchase of this article. Given as a whole number, e.g 24% is given as 24.
* ``purchasePriceWithTax`` - The purchase price of a base unit of this article including tax.
* ``portionSize`` - Size of a portion by which this article is sold.
* ``saleArticleContents`` - Contents of a sale article as a list of [Content Articles](#contentarticle).
* ``articleContents`` - Contents of a storage or recipe article as a list of [Content Articles](#contentarticle).
* ``prices`` - A list of [Price Lists](#pricelist) that are active for this article.
* ``articleLinks`` - A list of [Content Articles](#contentarticle) that are sold when this article is sold.
* ``articleLinkPriceType`` - How the price of this link article should be calculated. Given as a [Article Link Price type](#article_link_pricetype) 
* ``eans`` - EAN codes of the article given as an array of strings.
* ``kitchenPrintingGroupID`` - Kitchen printing group ID of the article
* ``kitchenPrintingGroupName`` - Kitchen printing group name of the article

<a name="extendedarticle_import"></a>
### Extended Article (import)

The articles imported by the ``importArticles`` method are objects of ``ExtendedArticle`` with a subset of supported properties as specified below. The article in Restolution is identified by the ``saleArticleID`` for sale article properties and ``storageArticleID` for storage article properties. Imported articles must have at least either of these properties and can also have both.

* ``articleName`` _[string, max 50 chars, required]_ - article name
* ``articleGroupID`` _[string, numeric, required]_ - article group ID of this article, the article group's number in Restolution
* ``saleArticleID`` _[string, numeric, required]_ - sale article ID of this article if it is a sale article, sale article number in Restolution
* ``clientUUID``  _[string, optional]_ - globally unique identifier of the Restolution client that this article belongs to (a type 4 UUID as specified by RFC 4122). If set, the article will be imported only to this client.
* ``prices`` _[array, optional]_ - An array of [price list](https://github.com/Soft-Contact/resto/issues/9#pricelist) objects that are active for this article. See [getArticles](https://github.com/Soft-Contact/resto/issues/9) method for details. Note: only "prices", "priceListID", "priceID" and "priceWithTax" are supported. Other properties will be ignored.

<a name="contentarticle"></a>
### Content Article

Content articles can be the contents of a sale, storage or recipe article. They are also used as links of a link article. All content articles are also listed separately in the main ``articles`` list of the ``getArticles`` response.

* ``articleUUID`` -  globally unique identifier for this article (a type 4 UUID as specified by RFC 4122)
* ``articleName`` - article name
* ``saleArticleID`` - sale article ID of this article if it is a sale article
* ``storageArticleID`` - storage article ID of this article if it is a storage article
* ``recipeArticleID`` - recipe article ID of this article if it is a recipe article
* ``quantity`` - the usage unit quantity of the this article that is used in the contents
* ``usageUnit`` - usage unit that this storage article is used in when contained in other articles. E.g. a centilitre, CL.
* ``usageUnitInSIUnits`` - usage unit in SI units, e.g. how many centilitres in a litre, in 1/1000 parts.
* ``usageUnitsInBaseUnit`` - usage units in base unit, how many usage units fit into one base unit, e.g. 70 centilitres in one bottle, in 1/1000 parts.
* ``baseUnit`` - base unit that is used as a base for storage amounts, e.g. a bottle, BTL.
* ``baseUnitInSIUnits`` - base unit in SI units, e.g. how many litres in a bottle. Note that this defaults to 1 for all units that can have different sizes, in 1/1000 parts.
* ``baseUnitsInDeliveryUnit`` - base units in delivery unit, e.g. 20 bottles in a box.
* ``deliveryUnit`` - delivery unit that the article arrives to the storage in, e.g. a box.
* ``deliveryUnitInSIUnits`` - delivery unit in SI units. Note that this defaults to 1 for all units that can have different sizes, in 1/1000 parts.
* ``purchasePriceWithTax`` - The purchase price of a base unit of this article including tax
* ``purchaseTax`` - Purchase tax percentage applied to the the purchase of this article. Given as a whole number, e.g 24% is given as 24.
* ``modifiedDate`` - when this article was last modified

<a name="pricelist"></a>
### PriceList
A PriceList is a named list of prices with a validity period that belongs to some other object, e.g. an [Extended Article](#extendedarticle).

* ``priceListID`` - ID of this price list
* ``priceListName`` - price list name
* ``validFrom`` - when this price list becomes valid. If missing, this pricelist was always valid.
* ``validUntil`` - when this price list is no longer valid. If missing, this pricelist is valid forever.
* ``prices`` - a list of [Prices](#price) contained in this price list

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
* ``changeAccountCode`` - change bookkeeping account code for monthly storage change, see [getBookkeepingRows](#getbookkeepingrows)
* ``code`` - bookkeeping code, article group SAP code or transaction type code in Restolution
* ``amount`` - sum of sales (negative), payments (positive) and inpayments (negative) in cents
* ``netAmount`` - amount without VAT in cents
* ``vatAmount`` - VAT amount in cents
* ``vatCode`` - VAT code
* ``startAmount`` - start amount for monthly storage change without VAT in cents, see [getBookkeepingRows](#getbookkeepingrows)
* ``endAmount`` - end amount for monthly storage change without VAT in cents, see [getBookkeepingRows](#getbookkeepingrows)
* ``differenceAmount`` - difference amount for monthly storage change without VAT in cents, see [getBookkeepingRows](#getbookkeepingrows) 

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

<a name="deliverynote"></a>
### Delivery Note

The delivery notes returned by the "getDeliveryNotes" method are objects of "Delivery Note" which contains the rows of the delivery note as an array of [Delivery Note Rows](#deliverynoterow).

* ``deliveryNoteUUID`` - globally unique identifier of the DeliveryNote (a type 4 UUID as specifield by RFC 4122)
* ``clientUUID`` - globally unique identifier of the Restolution client that this delivery note belongs to (a type 4 UUID as specified by RFC 4122)
* ``orderUUID`` - globally unique identifier of the Restolution Order corresponding to this DeliveryNote
* ``orderNumber`` - number of the Order in Restolution that corresponds to the DeliveryNote
* ``deliveryDate`` - timestamp when this delivery note took place and affected the storage values
* ``verifiedDate`` - timestamp when this delivery note was verified
* ``businessUnitUUID`` - globally unique identifier of the Restolution business unit that this delivery note added to (a type 4 UUID as specified by RFC 4122)
* ``toStorageName`` - name of the storage that this delivery note added to
* ``userName`` - name of user who created this delivery note
* ``status`` - the status of this delivery note, can be one of IN_PROGRESS, DONE, VERIFIED. 
* ``deliveryNoteRows`` - array of delivery note rows

<a name="deliverynoterow"></a>
### Delivery Note Row

The delivery note rows contain on article level the quantities and purchase prices of the delivery note.

* ``articleUUID`` -  globally unique identifier for this delivery note row's article (a type 4 UUID as specified by RFC 4122)
* ``articleName`` - article name of this delivery note row's article
* ``storageArticleID`` - storage article ID of this delivery note row's storage article
* ``quantity`` - the SI unit quantity of the article of this delivery note row  in 1/1000 parts
* ``quantityInBaseUnits`` - the baseunit quantity of the article of this delivery note row  in 1/1000 parts
* ``baseUnit`` - the base unit of this delivery note row's article, e.g. a bottle, BTL.
* ``baseUnitInSIUnits`` - base unit in SI units, e.g. how many grams in a kilogram. Note that this defaults to 1 for all units that can have different sizes, in 1/1000 parts.
* ``purchasePriceWithTax`` - The purchase price of a base unit of this delivery note row's article including tax
* ``purchaseTax`` - The purchase tax percentage applied to the purchase of this delivery note row's article. Given as a whole number, e.g 24% is given as 24.

<a name="transfer"></a>
### Transfer

The transfers returned by the "getTransfers" method are objects of "Transfer" which contains the rows of the transfer as an array of [Transfer Rows](#transferrow).

* ``clientUUID`` - globally unique identifier of the Restolution client that this transfer belongs to (a type 4 UUID as specified by RFC 4122)
* ``transferDate`` - timestamp when this transfer took place and affected the storage values
* ``verifiedDate`` - timestamp when this transfer was verified
* ``fromBusinessUnitUUID`` - globally unique identifier of the Restolution business unit that this transfer reduced (a type 4 UUID as specified by RFC 4122)
* ``toBusinessUnitUUID`` - globally unique identifier of the Restolution business unit that this transfer added to (a type 4 UUID as specified by RFC 4122)
* ``fromStorageName`` - name of the storage that this transfer reduced
* ``toStorageName`` - name of the storage that this transfer added to
* ``userName`` - name of user who created this transfer
* ``verifier`` - name of user who verified this transfer
* ``status`` - the status of this transfer, can be one of IN_PROGRESS, DONE, VERIFIED. 
* ``comment`` - a comment about this transfer
* ``transferRows`` - array of transfer rows

<a name="transferrow"></a>
### Transfer Row

The transfer rows contain on article level the quantities and purchase prices of the transfer.

* ``articleUUID`` -  globally unique identifier for this transfer row's article (a type 4 UUID as specified by RFC 4122)
* ``articleName`` - article name of this transfer row's article
* ``storageArticleID`` - storage article ID of this transfer row's storage article
* ``quantity`` - the SI unit quantity of the article of this transfer row  in 1/1000 parts
* ``quantityInBaseUnits`` - the baseunit quantity of the article of this transfer row  in 1/1000 parts
* ``baseUnit`` - the base unit of this transfer row's article, e.g. a bottle, BTL.
* ``baseUnitInSIUnits`` - base unit in SI units, e.g. how many grams in a kilogram. Note that this defaults to 1 for all units that can have different sizes, in 1/1000 parts.
* ``purchasePriceWithTax`` - The purchase price of a base unit of this transfer row's article including tax
* ``purchaseTax`` - The purchase tax percentage applied to the purchase of this transfer row's article. Given as a whole number, e.g 24% is given as 24.

<a name="wastage"></a>
### Wastage

The wastages returned by the [getWastages](#getwastages) method are objects of "Wastage" which contains the rows of the wastage as an array of [Wastage Rows](#wastagerow).

* ``clientUUID`` - globally unique identifier of the Restolution client that this wastage belongs to (a type 4 UUID as specified by RFC 4122)
* ``wastageDate`` - timestamp when this wastage took place and affected the storage values
* ``verifiedDate`` - timestamp when this wastage was verified
* ``businessUnitUUID`` - globally unique identifier of the Restolution business unit that this wastage added to (a type 4 UUID as specified by RFC 4122)
* ``toStorageName`` - name of the storage that this wastage added to
* ``userName`` - name of user who created this wastage
* ``status`` - the status of this wastage, can be one of IN_PROGRESS, DONE, VERIFIED. 
* `wastageRows`` - array of wastage rows

<a name="wastagerow"></a>
### Wastage Row

The wastage rows contain on article level the quantities and purchase prices of a [Wastage](#wastage).

* ``articleUUID`` -  globally unique identifier for this wastage row's article (a type 4 UUID as specified by RFC 4122)
* ``articleName`` - article name of this wastage row's article
* ``saleArticleID`` - sale article ID of this wastage row's article. Note: this is only shown when ``useStorageDistribution`` is set to ``false``
* ``wastageQuantity`` - the sale article quantity of the sale article originally entered for this wastage row  in 1/1000 parts. Note: this is only shown when ``useStorageDistribution`` is set to ``false``
* ``storageArticleID`` - storage article ID of this wastage row's article. Note: this is only shown when ``useStorageDistribution`` is set to ``true``
* ``storageQuantity`` - the SI unit quantity of the article of this wastage row  in 1/1000 parts. Note: this is only shown when ``useStorageDistribution`` is set to ``true``
* ``storageQuantityInBaseUnits`` - the baseunit quantity of the article of this wastage row  in 1/1000 parts. Note: this is only shown when ``useStorageDistribution`` is set to ``true``
* ``baseUnit`` - the base unit of this wastage row's article, e.g. a bottle, BTL. Note: this is only shown when ``useStorageDistribution`` is set to ``true``
* ``baseUnitInSIUnits`` - base unit in SI units, e.g. how many grams in a kilogram. Note that this defaults to 1 for all units that can have different sizes, in 1/1000 parts. Note: this is only shown when ``useStorageDistribution`` is set to ``true``
* ``purchasePriceWithTax`` - The purchase price of a base unit of this wastage row's article including tax at the time of the wastage
* ``purchaseTax`` - The purchase tax percentage applied to the purchase of this wastage row's article. Given as a whole number, e.g 24% is given as 24.

<a name="inventory"></a>
### Inventory

The inventories returned by the [getInventories](#getinventories) method are objects of "Inventory" which contains the rows of the inventory as an array of [Inventory Rows](#inventoryrow).

* ``clientUUID`` - globally unique identifier of the Restolution client that this inventory belongs to (a type 4 UUID as specified by RFC 4122)
* ``periodStart`` - timestamp when this inventory's period starts
* ``periodEnd`` - timestamp when this inventory's period ends
* ``calculationDate`` - timestamp of the actual (physical) inventory. Ie. the date when user counted the articles in stock (calculated the inventory).
* ``verifiedDate`` - timestamp when this inventory was verified
* ``businessUnitUUID`` - globally unique identifier of the Restolution business unit that this inventory was made for (a type 4 UUID as specified by RFC 4122)
* ``storageName`` - name of the storage that this inventory was made for
* ``userName`` - name of user who created this inventory
* ``verifier`` - name of user who verified this inventory
* ``status`` - the status of this inventory, can be one of IN_PROGRESS, DONE, VERIFIED. 
* ``comment`` - a comment about this inventory
* ``inventoryRows`` - array of inventory rows

<a name="inventoryrow"></a>
### Inventory Row

The inventory rows contain on article level the quantities and purchase prices of the [Inventory](#inventory).

* ``articleUUID`` -  globally unique identifier for this inventory row's article (a type 4 UUID as specified by RFC 4122)
* ``articleName`` - article name of this inventory row's article
* ``storageArticleID`` - storage article ID of this inventory row's storage article
* ``quantity`` - the SI unit quantity of the article of this inventory row  in 1/1000 parts
* ``quantityInBaseUnits`` - the baseunit quantity of the article of this inventory row  in 1/1000 parts
* ``oldQuantity`` - the SI unit storage quantity of the article of this inventory row before the inventory quantity was entered in 1/1000 parts
* ``oldQuantityInBaseUnits`` - the baseunit storage quantity of the article of this inventory row before the inventory quantity was entered in 1/1000 parts
* ``baseUnit`` - the base unit of this inventory row's article, e.g. a bottle, BTL.
* ``baseUnitInSIUnits`` - base unit in SI units, e.g. how many grams in a kilogram. Note that this defaults to 1 for all units that can have different sizes, in 1/1000 parts.
* ``purchasePriceWithTax`` - The purchase price of a base unit of this inventory row's article including tax
* ``purchaseTax`` - The purchase tax percentage applied to the purchase of this inventory row's article. Given as a whole number, e.g 24% is given as 24.

<a name="storagevalue"></a>
### Storage Value

The storage values returned by the [getStorageValues](#getstoragevalues) method are objects of "Storage Value" and contain data fields for calculating the storage value for a given date. A separate storage value is maintained for every storage article in Restolution.

* ``clientUUID`` - globally unique identifier of the Restolution client that this storage value belongs to (a type 4 UUID as specified by RFC 4122)
* ``businessUnitUUID`` - globally unique identifier of the Restolution business unit that this storage value belongs to (a type 4 UUID as specified by RFC 4122)
* ``restaurantID`` - restaurant ID, business unit code in Restolution
* ``restaurantName`` - restaurant name, business unit name in Restolution
* ``storageName`` - name of the storage that this storage value is for. Note that one restaurant (business unit) can have several storages.
*  ``mainGroupID``
* ``mainGroupID`` - main group ID of this storage value's article
* ``mainGroupName`` - main group name of this storage value's article
* ``articleGroupID`` - article group ID of this storage value's article
* ``articleGroupName`` - article group name of this storage value's article
* ``articleUUID`` -  globally unique identifier for the this storage value's article (a type 4 UUID as specified by RFC 4122)
* ``articleName`` - article name of this storage value's article
* ``storageArticleID`` - storage article ID of this storage value's storage article
* ``quantity`` - the SI unit quantity of the article of this storage value  in 1/1000 parts
* ``quantityInBaseUnits`` - the baseunit quantity of the article of this storage value  in 1/1000 parts
* ``baseUnit`` - the base unit of this storage value's article, e.g. a bottle, BTL.
* ``baseUnitInSIUnits`` - base unit in SI units, e.g. how many litres in a bottle. Note that this defaults to 1 for all units that can have different sizes, in 1/1000 parts.
* ``purchasePriceWithTax`` - The purchase price of a base unit of this storage value's article including tax
* ``purchaseTax`` - Purchase tax percentage applied to the the purchase of this storage value's article. Given as a whole number, e.g 24% is given as 24.

<a name="employee"></a>
### Employee
An Employee in Restolution.
See also [listEmployees](#listemployees).

* ``employeeNumber`` - alphanumeric employee ID, must be unique per Restolution client
* ``firstName`` - first name of the employee
* ``lastName`` - last name of the employee
* ``type`` - optional type of the employee, see [Employee types](#employee-types). If missing, it will default to EMPLOYEE when importing a new Employee.

<a name="timetracking"></a>
### TimeTracking
An object used for tracking (work) time of and [Employee](#employee).
See also [importTimeTrackings](#importtimetrackings).

* ``employeeNumber`` - employee ID of the employee that this time tracking was recorded for
* ``unitUUID`` - UUID of the Restautant unit where the time tracking was recorded
* ``startTime`` - timestamp when the time tracking period started
* ``endTime`` - timestamp when the time tracking period ended
* ``comment`` - optional comment for the time tracking

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
* ``salesReadUntilDate`` - include sales read to back office before given date, defaults to current timestamp. The period limited by ``salesReadFromDate`` and ``salesReadUntilDate`` cannot exceed 7 days.	
* ``receiptTimeFromDate`` - include receipts with timestamp equal or later than given date. Overrides ``salesReadFromDate``.
* ``receiptTimeUntilDate`` - include receipts with timestamp equal or older than given date
* ``includeSaleRows`` - include sales receipt rows in the results
* ``includePaymentRows`` - include payment receipt rows in the results
* ``invoiceReceiptsOnly`` - true / false to include only invoice receipts
* ``reconciliatedDatesOnly`` - true / false if results should include only reconciliated dates. Can be used only when ``invoiceReceiptsOnly`` = true.
* ``includeRowComments`` - true / false if row comments should be included (included by default if ``invoiceReceiptsOnly`` = true)
* ``includeAccountingInfo`` - true / false if Bookkeeping account codes should be included on sale and payment rows (also requires either ``includeSaleRows`` or ``includePaymentRows``)
* ``customerReceiptsOnly`` - true / false to include only receipts that have a customer

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
		"cardCustomData1": "earl.grantham@example.com",
                "cardCustomData2": "555 12345678",
                "cardCustomData3": "some other information"
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
* ``showMonthlyStorageData`` - true / false to include ``startAmount``, ``endAmount``, ``differenceAmount`` and ``changeAccountCode``, for a given month as specified by parameter ``month`` which is also required if this parameter is given. Using this parameter will return the values of the "Storage value change report" in Restolution. See also [Bookkeeping row](#bookkeeping-row).
* ``month`` - show monthly storage data from the given month. Month is given in the format "MM/YYYY". This parameter is required if the paramater ``showMonthlyStorageData`` is given.

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

<a name="getdeliverynotes"></a>
### getDeliveryNotes
Gets all storage delivery notes from Restolution. The delivery notes are returned as an array of [DeliveryNotes](#deliverynote). The endpoint mimics the parameters and data in Delivery Note Reports in Restolution.

parameters:

* ``dateFrom`` - get delivery notes that have delivery note date equal to or later than this date. This parameter is required.
* ``dateUntil`` - get delivery notes that have delivery note date equal to or earlier than this date.
* ``businessUnitUUIDs`` - optional list of business unit UUID's whose delivery notes should be included. If this parameter is not given, the delivery notes of all business units will be included.

response:

* ``deliveryNotes`` - array of DeliveryNote objects

sample request:

```json
{
  "apiKey":"user_321683", 
  "timestamp": "2022-01-20T15:13:40.988Z",
  "requestID": "test_request_id",
  "method": "getDeliveryNotes",
  "params": {
      "dateFrom":"2018-08-01T05:00:00.00Z",
      "dateUntil":"2018-08-07T04:59:59.99Z",
      "businessUnitUUIDs": ["0b4a62aa-f857-4282-8dbb-ca26c0b1468c"]
  }   
}
```

sample response:
```json
{
  "success": true,
  "timestamp": "2022-04-04T12:00:02.522Z",
  "requestID": "test_request_id",
  "response": {
    "deliveryNotes": [
      {
        "deliveryNoteUUID": "20e8cbef-9b97-4a0b-b930-c7d16efacad8",
        "clientUUID": "0016eb0e-a9e2-4a82-a4a1-b33b6483ef57",
        "deliveryDate": "2018-08-02T04:59:59.99",
        "verifiedDate": "2018-08-01T08:03:39.787",
        "businessUnitUUID": "0b4a62aa-f857-4282-8dbb-ca26c0b1468c",
        "storageName": "Testivarasto 1",
        "userName": "Milla Mallikas",
        "status": "VERIFIED",
        "comment": "comment",
        "deliveryNoteRows": [
          {
            "articleUUID": "4f71d138-f870-49d3-8712-f6e55de0d760",
            "storageArticleID": "1234",
            "articleName": "Ketsuppi",
            "quantity": 2112,
            "quantityInBaseUnits": 24000,
            "baseUnit": "PLO",
            "baseUnitInSIUnits": 88,
            "purchasePriceWithTax": 114,
            "purchaseTax": 14
          },
          {
            "articleUUID": "044de386-a5ef-4a08-91e9-67a30f7c1062",
            "storageArticleID": "2345",
            "articleName": "Sipulikeitto",
            "quantity": 15200,
            "quantityInBaseUnits": 4000,
            "baseUnit": "TLK",
            "baseUnitInSIUnits": 3800,
            "purchasePriceWithTax": 118,
            "purchaseTax": 14
          }
        ]
      }
    ]
  }
}
```

<a name="gettransfers"></a>
### getTransfers
Gets all storage transfers from Restolution. The transfers are returned as an array of [Transfers](#transfer). The endpoint mimics the parameters and data in Transfer Summary Report in Restolution.

parameters:

* ``dateFrom`` - get transfers that have transfer date equal to or later than this date. This parameter is required.
* ``dateUntil`` - get transfers that have transfer date equal to or earlier than this date.
* ``businessUnitUUIDs`` - optional list of business unit UUID's whose transfers (from or to) should be included. If this parameter is not given, the transfers of all business units will be included.

response:

* ``transfers`` - array of Transfer objects

sample request:

```json
{
  "apiKey":"user_321683", 
  "timestamp": "2022-01-20T15:13:40.988Z",
  "requestID": "test_request_id",
  "method": "getTransfers",
  "params": {
      "dateFrom":"2022-01-01T05:00:00.00Z",
      "dateUntil":"2022-01-07T04:59:59.99Z",
      "businessUnitUUIDs": ["e2223c3b-5f6d-4873-b21b-2c06a2d6fe1b","4a67c7a2-bbf6-4130-be16-f4f7b2571d92"]
  }   
}
```

sample response:
```json
{
  "success": true,
  "timestamp": "2022-04-04T08:46:58.426Z",
  "requestID": "test_request_id",
  "response": {
    "transfers": [
      {
        "clientUUID": "fba3d9ac-1bb6-49ea-a1cd-d147d6a7e238",
        "transferDate": "2021-08-18T04:59:59.99",
        "verifiedDate": "2021-08-17T12:41:10.869",
        "fromBusinessUnitUUID": "e2223c3b-5f6d-4873-b21b-2c06a2d6fe1b",
        "toBusinessUnitUUID": "4a67c7a2-bbf6-4130-be16-f4f7b2571d92",
        "fromStorageName": "Testivarasto 1",
        "toStorageName": "Testivarasto 2",
        "userName": "Milla Mallikas",
        "verifier": "Milla Mallikas",
        "status": "VERIFIED",
        "comment": "comment",
        "transferRows": [
          {
            "articleUUID": "a23ccb6d-f819-40b7-82ba-549d20dc499c",
            "storageArticleID": "816",
            "articleName": "Craft IPA",
            "quantity": 40500,
            "quantityInBaseUnits": 54000,
            "baseUnit": "PLO",
            "baseUnitInSIUnits": 750,
            "purchasePriceWithTax": 1620,
            "purchaseTax": 24
          },
          {
            "articleUUID": "334fca7c-e419-4b7d-846b-8d5422091ceb",
            "storageArticleID": "104",
            "articleName": "Fine Sherry",
            "quantity": 18750,
            "quantityInBaseUnits": 25000,
            "baseUnit": "PLO",
            "baseUnitInSIUnits": 750,
            "purchasePriceWithTax": 500,
            "purchaseTax": 24
          }
        ]
      }
    ]
  }
}
```

<a name="getwastages"></a>
### getWastages
Gets all storage wastages from Restolution. The wastages are returned as an array of [Wastages](#wastage). The enpoint mimics the parameters and data in Article Wastage Report in Restolution.

parameters:

* ``dateFrom`` - get wastages that have wastage date equal to or later than this date. This parameter is required.
* ``dateUntil`` - get wastages that have wastage date equal to or earlier than this date.
* ``businessUnitUUIDs`` - optional list of business unit UUID's whose wastages should be included. If this parameter is not given, the wastages of all business units will be included.
* ``useStorageDistribution`` - when set to ``true``, show wastage rows with storage value changes, else show wastage row with sale articles and original amounts entered for the wastage

response:

* ``wastages`` - array of Wastage objects

sample requests:

```json
{
  "timestamp": "2015-09-16T08:58:40.988Z",
  "apiKey": "user_321681",
  "requestID": "req_325168426",
  "method": "getWastages",
  "params": {
    "dateFrom": "2021-03-01T05:00:00.000",
    "dateUntil": "2021-03-02T04:59:59.990",
    "useStorageDistribution": true
  }
}
```

```json
{
  "timestamp": "2015-09-16T08:58:40.988Z",
  "apiKey": "test_user",
  "requestID": "test_request_id",
  "method": "getWastages",
  "params": {
    "dateFrom": "2022-03-01T05:00:00.000",
    "dateUntil": "2022-03-02T04:59:59.990",
    "useStorageDistribution": false
  }
}
```

sample responses:
```json
{
  "success": true,
  "timestamp": "2022-04-06T07:47:08.864Z",
  "requestID": "test_request_id",
  "response": {
    "wastages": [
      {
        "clientUUID": "fba3d9ac-1bb6-49ea-a1cd-d147d6a7e238",
        "registrationDate": "2022-04-06T10:38:10.709",
        "wastageDate": "2022-03-02T04:59:59.99",
        "verifiedDate": "2022-04-06T10:39:17.432",
        "businessUnitUUID": "4a67c7a2-bbf6-4130-be16-f4f7b2571d93",
        "storageName": "Testivarasto",
        "unitName": "Testiosasto",
        "userName": "Milla Mallikas",
        "verifier": "Milla Mallikas",
        "status": "VERIFIED",
        "wastageRows": [
          {
            "articleUUID": "b66864ae-bef0-4932-a1ff-ec0b9409330e",
            "storageArticleID": "452",
            "articleName": "Karpalomehu",
            "wastageTypeName": "kaatunut",
            "wastageTypeCode": "KAATUNUT",
            "storageQuantity": 120,
            "storageQuantityInBaseUnits": 160,
            "baseUnit": "PLO",
            "baseUnitInSIUnits": 750,
            "purchasePriceWithTax": 796,
            "purchaseTax": 14
          },
          {
            "articleUUID": "fd846756-e347-471e-8749-a86e311e327e",
            "storageArticleID": "1230",
            "articleName": "Gin",
            "wastageTypeName": "kaatunut",
            "wastageTypeCode": "KAATUNUT",
            "storageQuantity": 40,
            "storageQuantityInBaseUnits": 57,
            "baseUnit": "PLO",
            "baseUnitInSIUnits": 700,
            "purchasePriceWithTax": 3900,
            "purchaseTax": 24
          },
          {
            "articleUUID": "301d239e-ecf1-4f3e-bdd1-6c9adaf63afc",
            "storageArticleID": "1231",
            "articleName": "Halpa viina",
            "wastageTypeName": "kaatunut",
            "wastageTypeCode": "KAATUNUT",
            "storageQuantity": 40,
            "storageQuantityInBaseUnits": 57,
            "baseUnit": "PLO",
            "baseUnitInSIUnits": 700,
            "purchasePriceWithTax": 1900,
            "purchaseTax": 24
          },
          {
            "articleUUID": "334fca7c-e419-4b7d-846b-8d5422091cec",
            "storageArticleID": "104",
            "articleName": "Sherry",
            "wastageTypeName": "viallinen",
            "wastageTypeCode": "VIALLINEN",
            "storageQuantity": 40,
            "storageQuantityInBaseUnits": 53,
            "baseUnit": "PLO",
            "baseUnitInSIUnits": 750,
            "purchasePriceWithTax": 4800,
            "purchaseTax": 24
          }
        ]
      }
    ]
  }
}
```

```json
{
  "success": true,
  "timestamp": "2022-04-06T08:22:39.405Z",
  "requestID": "req_325168426",
  "response": {
    "wastages": [
      {
        "clientUUID": "fba3d9ac-1bb6-49ea-a1cd-d147d6a7e238",
        "registrationDate": "2022-04-06T10:38:10.709",
        "wastageDate": "2022-03-02T04:59:59.99",
        "verifiedDate": "2022-04-06T10:39:17.432",
        "businessUnitUUID": "4a67c7a2-bbf6-4130-be16-f4f7b2571d92",
        "storageName": "Testivarasto",
        "unitName": "Testiosasto",
        "userName": "Milla Mallikas",
        "verifier": "Milla Mallikas",
        "status": "VERIFIED",
        "wastageRows": [
          {
            "articleUUID": "18f7cc30-b7ce-4433-932a-0ffb67915264",
            "saleArticleID": "12411",
            "articleName": "Linkkidrinkki",
            "wastageTypeName": "kaatunut",
            "wastageTypeCode": "KAATUNUT",
            "wastageQuantity": 1000,
            "purchasePriceWithTax": 459,
            "purchaseTax": 24
          },
          {
            "articleUUID": "71286413-03cd-45a1-a216-c7061a2fd569",
            "saleArticleID": "12341",
            "articleName": "Sherry 4cl",
            "wastageTypeName": "viallinen",
            "wastageTypeCode": "VIALLINEN",
            "wastageQuantity": 1000,
            "purchasePriceWithTax": 67,
            "purchaseTax": 24
          }
        ]
      }
    ]
  }
}
```

<a name="getinventories"></a>
### getInventories
Gets all inventories from Restolution. The inventories are returned as an array of [Inventory](#inventory). The endpoint mimics the parameters and data in Inventory Report in Restolution.

parameters:

* ``month`` - get inventories whose inventory period start and end at the given month. Month is given in the format "MM/YYYY". This parameter is required.
* ``businessUnitUUIDs`` - optional list of business unit UUID's whose inventories should be included. If this parameter is not given, the inventories of all business units will be included.

response:

* ``inventories`` - array of inventory objects

sample request:

```json
{
  "apiKey":"user_321683", 
  "timestamp": "2022-01-20T15:13:40.988Z",
  "requestID": "test_request_id",
   "method": "getInventories",
	"params": {
		"month": "4/2022",
		"businessUnitUUIDs": [
			"4a67c7a2-bbf6-4130-be16-f4f7b2571d97",
			"4a67c7a2-bbf6-4130-be16-f4f7b2571d94"
		]
	}
}
```

sample response:
```json
{
  "success": true,
  "timestamp": "2022-04-04T08:46:58.426Z",
  "requestID": "test_request_id",
  "response": {
    "inventories": [
      {
        "clientUUID": "fba3d9ac-1bb6-49ea-a1cd-d147d6a7e233",
        "periodStart": "2022-04-01T05:00:00",
        "periodEnd": "2022-05-01T04:59:59.99",
        "calculationDate": "2022-05-20T04:59:59.99",
        "verifiedDate": "2022-05-20T10:18:03.439",
        "businessUnitUUID": "4a67c7a2-bbf6-4130-be16-f4f7b2571d97",
        "storageName": "Testivarasto 1",
        "userName": "Milla Mallikas",
        "verifier": "Milla Mallikas",
        "status": "VERIFIED",
        "inventoryRows": [
        {
            "articleUUID": "6aa2dc87-ad67-48df-98bc-4e926b1fbd7f",
            "storageArticleID": "123",
            "articleName": "Vodka",
            "quantity": 20,
            "quantityInBaseUnits": 28,
            "oldQuantity": 10,
            "oldQuantityInBaseUnits": 14,
            "baseUnit": "PLO",
            "baseUnitInSIUnits": 700,
            "purchasePriceWithTax": 1213,
            "purchaseTax": 24
          },
          {
            "articleUUID": "82bc1573-69d5-4c1d-9a3f-bf060f7323d1",
            "storageArticleID": "124",
            "articleName": "Likööri",
            "quantity": 300,
            "quantityInBaseUnits": 429,
            "oldQuantity": 200,
            "oldQuantityInBaseUnits": 286,
            "baseUnit": "PLO",
            "baseUnitInSIUnits": 700,
            "purchasePriceWithTax": 2123,
            "purchaseTax": 24
          }
        ]
      }
    ]
  }
}
```

<a name="getarticles"></a>
### getArticles
Gets all articles from restolution. The articles are returned as an array of [Extended Articles](#extended_article).

<b>Note 1: All prices are given as cents and all amounts, including unit conversion amounts, are given as 1/1000 parts. No calculated results, only raw data is returned. This is to prevent rounding errors.</b>

<b>Note 2: Since the results contain also storage articles and recipe articles, the results are not limited by articles added to the link of the JSON API key. This simply means that all articles of the clients affected by the used JSON API key are returned.</b>

<b>Note 3: Only non-empty values are included in the response. E.g. for a simple sale article (`"mainType": "SALE_ARTICLE", "subType": "SIMPLE"`) that has no storage data, the storage fields e.g. `storageArticleID` will be missing in the response.

The returned articles can be limited by their modification timestamp by using the parameters `modifiedAfter` and `modifiedBefore`. Since the article's data is stored across several tables, the article is regarded as modified if any of the related tables have been modified during the given date limit: i.e. if the article's content or group or operation group was modified, the article will be returned in the response. The `modifiedAfter `and `modifiedBefore` can be used alone or together. If neither parameter is given, all articles are returned.</b>

parameters:

*  ``modifiedAfter`` - include only articles with modification timestamp later than the given date (optional)
*  ``modifiedBefore`` - include only articles with modification timestamp earlier than the given date (optional)
*  ``includeAllArticles`` - true / false to include articles with any status, if false, only ACTIVE articles will be returned (optional)

response:

* ``articles`` - array of articles containing article sale and storage data, contents, links and prices

sample request: 

```json
{
  "apiKey":"user_321681", 
  "timestamp": "2022-01-20T15:13:40.988Z",
  "requestID": "test_request_id",
  "method": "getArticles",
  "params": {
      "modifiedAfter":"2022-01-21T03:00:00.000Z",
      "modifiedBefore":"2022-01-21T07:00:00.000Z"       
  }   
}
```

sample response:
```json
{
  "success": true,
  "timestamp": "2022-01-24T08:18:52.476Z",
  "requestID": "test_request_id",
  "response": {
    "articles": [
      {
        "articleName": "Tuoppi",
        "articleUUID": "012917ab-077d-454f-aeef-4e9df6f2252f",
        "clientUUID": "b7411483-1228-4a48-a98f-abccab09e84d",
        "operationGroupID": "1",
        "operationGroupName": "Hallintaryhmä 1",
        "modifiedDate": "2022-01-24T10:10:41.31",
        "mainType": "SALE_ARTICLE",
        "subType": "SIMPLE",
        "status": "ACTIVE",
        "mainGroupID": "3",
        "mainGroupName": "OLUT",
        "articleGroupID": "11",
        "articleGroupName": "Olut III",
        "saleArticleID": "8810",
        "saleTax": 24,
        "purchaseTax": 24,
        "purchasePriceWithTax": 6000,
        "portionSize": 400,
        "kitchenPrintingGroupID": "1",
        "kitchenPrintingGroupName": "Omituiset pääruoat",
        "saleArticleContents": [
          {
            "articleName": "Tankkiolut",
            "articleUUID": "12404580-08b4-4796-b7b6-c558e3780b94",
            "recipeArticleID": "RECIPE_881",
            "quantity": 500,
            "purchasePriceWithTax": 0,
            "purchaseTax": 24,
            "modifiedDate": "2022-01-24T10:10:41.343"
          }
        ],
        "prices": [
          {
            "priceListID": "19",
            "priceListName": "Uusi hinnasto",
            "validFrom": "2018-06-15T05:00:00",
            "prices": [
              {
                "priceID": "1",
                "priceName": "Normaali",
                "priceWithTax": 720,
                "tax": 24
              },
              {
                "priceID": "2",
                "priceName": "Take away",
                "priceWithTax": 720,
                "tax": 24
              }
            ]
          }
        ]
      },
      {
        "articleName": "Keskiolut 20 L",
        "articleUUID": "09f7f6ff-7ce6-4efe-b57c-80b9f2e27c59",
        "clientUUID": "b7411483-1228-4a48-a98f-abccab09e84d",
        "operationGroupID": "1",
        "operationGroupName": "Hallintaryhmä 1",
        "modifiedDate": "2022-01-24T10:13:13.218",
        "mainType": "STORAGE_ARTICLE",
        "subType": "SIMPLE",
        "status": "ACTIVE",
        "mainGroupID": "3",
        "mainGroupName": "OLUT",
        "articleGroupID": "11",
        "articleGroupName": "Olut III",
        "storageArticleID": "10088",
        "usageUnit": "L",
        "usageUnitInSIUnits": 1000,
        "usageUnitsInBaseUnit": 20000,
        "baseUnit": "tnk",
        "baseUnitInSIUnits": 20000,
        "baseUnitsInDeliveryUnit": 1000,
        "deliveryUnit": "tnk",
        "deliveryUnitInSIUnits": 1000,
        "saleTax": 24,
        "purchaseTax": 24,
        "purchasePriceWithTax": 14000
      },
      {
        "articleName": "Tankkiolut",
        "articleUUID": "12404580-08b4-4796-b7b6-c558e3780b94",
        "clientUUID": "b7411483-1228-4a48-a98f-abccab09e84d",
        "operationGroupID": "1",
        "operationGroupName": "Hallintaryhmä 1",
        "modifiedDate": "2022-01-24T10:11:44.598",
        "mainType": "RECIPE_ARTICLE",
        "subType": "COMBINED",
        "status": "ACTIVE",
        "mainGroupID": "3",
        "mainGroupName": "OLUT",
        "articleGroupID": "11",
        "articleGroupName": "Olut III",
        "recipeArticleID": "RECIPE_881",
        "recipeQuantity": 20000,
        "recipeUnit": "L",
        "saleTax": 24,
        "purchaseTax": 24,
        "purchasePriceWithTax": 0,
        "articleContents": [
          {
            "articleName": "Keskiolut 20 L",
            "articleUUID": "09f7f6ff-7ce6-4efe-b57c-80b9f2e27c59",
            "storageArticleID": "10088",
            "quantity": 20000,
            "usageUnit": "L",
            "usageUnitInSIUnits": 1000,
            "usageUnitsInBaseUnit": 20000,
            "baseUnit": "tnk",
            "baseUnitInSIUnits": 20000,
            "baseUnitsInDeliveryUnits": 1000,
            "deliveryUnit": "tnk",
            "deliveryUnitInSIUnits": 1000,
            "purchasePriceWithTax": 14000,
            "purchaseTax": 24,
            "modifiedDate": "2022-01-24T10:11:44.611"
          }
        ]
      },
      {
        "articleName": "Viina 4cl",
        "articleUUID": "18da9daa-90f9-4541-829d-9b4ebefed030",
        "clientUUID": "6f85ae63-56dc-48fd-be0e-881d74d14617",
        "operationGroupID": "21",
        "operationGroupName": "Hallintaryhmä 21",
        "modifiedDate": "2022-01-24T10:15:11.198",
        "mainType": "SALE_STORAGE_ARTICLE",
        "subType": "SIMPLE",
        "status": "ACTIVE",
        "mainGroupID": "1",
        "mainGroupName": "Alko",
        "articleGroupID": "1",
        "articleGroupName": "Alko",
        "saleArticleID": "7710",
        "storageArticleID": "77101",
        "usageUnit": "CL",
        "usageUnitInSIUnits": 10,
        "usageUnitsInBaseUnit": 50000,
        "baseUnit": "PLO",
        "baseUnitInSIUnits": 500,
        "baseUnitsInDeliveryUnit": 1000,
        "deliveryUnit": "PLO",
        "deliveryUnitInSIUnits": 1000,
        "saleTax": 24,
        "purchaseTax": 24,
        "purchasePriceWithTax": 5080,
        "portionSize": 40,
        "prices": [
          {
            "priceListID": "1",
            "priceListName": "Vanha hinnasto",
            "validFrom": "2016-10-17T05:00:00",
            "prices": [
              {
                "priceID": "1",
                "priceName": "Normi",
                "priceWithTax": 1100,
                "tax": 24
              }
            ]
          }
        ]
      },
      {
        "articleName": "Drinkkimauste",
        "articleUUID": "7e5a186f-df5b-435b-8b48-3d9543774268",
        "clientUUID": "6f85ae63-56dc-48fd-be0e-881d74d14617",
        "operationGroupID": "21",
        "operationGroupName": "Hallintaryhmä 21",
        "modifiedDate": "2022-01-24T10:15:48.414",
        "mainType": "SALE_ARTICLE",
        "subType": "SIMPLE",
        "status": "ACTIVE",
        "mainGroupID": "3",
        "mainGroupName": "Ruoka",
        "articleGroupID": "3",
        "articleGroupName": "Ruoka",
        "saleArticleID": "7401",
        "saleTax": 14,
        "purchaseTax": 14,
        "purchasePriceWithTax": 0,
        "prices": [
          {
            "priceListID": "1",
            "priceListName": "Vanha hinnasto",
            "validFrom": "2016-10-17T05:00:00",
            "prices": [
              {
                "priceID": "1",
                "priceName": "Normi",
                "priceWithTax": 100,
                "tax": 14
              }
            ]
          }
        ]
      },
      {
        "articleName": "Halpa viina 4 cl",
        "articleUUID": "301d239e-ecf1-4f3e-bdd1-6c9adaf63afb",
        "clientUUID": "6f85ae63-56dc-48fd-be0e-881d74d14617",
        "operationGroupID": "21",
        "operationGroupName": "Hallintaryhmä 21",
        "modifiedDate": "2022-01-24T10:17:54.075",
        "mainType": "SALE_STORAGE_ARTICLE",
        "subType": "SIMPLE",
        "status": "ACTIVE", 
        "mainGroupID": "1",
        "mainGroupName": "Alko",
        "articleGroupID": "1",
        "articleGroupName": "Alko",
        "saleArticleID": "7770",
        "storageArticleID": "77701",
        "usageUnit": "CL",
        "usageUnitInSIUnits": 10,
        "usageUnitsInBaseUnit": 70000,
        "baseUnit": "PLO",
        "baseUnitInSIUnits": 700,
        "baseUnitsInDeliveryUnit": 1000,
        "deliveryUnit": "PLO",
        "deliveryUnitInSIUnits": 1000,
        "saleTax": 24,
        "purchaseTax": 24,
        "purchasePriceWithTax": 1900,
        "portionSize": 40,
        "prices": [
          {
            "priceListID": "1",
            "priceListName": "Vanha hinnasto",
            "validFrom": "2016-10-17T05:00:00",
            "prices": [
              {
                "priceID": "1",
                "priceName": "Normi",
                "priceWithTax": 850,
                "tax": 24
              }
            ]
          }
        ]
      },
      {
        "articleName": "Linkkidrinkki",
        "articleUUID": "18f7cc30-b7ce-4433-932a-0ffb67915263",
        "clientUUID": "6f85ae63-56dc-48fd-be0e-881d74d14617",
        "operationGroupID": "21",
        "operationGroupName": "Hallintaryhmä 21",
        "modifiedDate": "2022-01-24T10:16:25.529",
        "mainType": "SALE_ARTICLE",
        "subType": "LINK",
        "status": "ACTIVE",
        "mainGroupID": "1",
        "mainGroupName": "Alko",
        "articleGroupID": "13",
        "articleGroupName": "Cocktailit",
        "saleArticleID": "7311",
        "saleTax": 24,
        "purchaseTax": 24,
        "purchasePriceWithTax": 0,
        "articleLinks": [
          {
            "articleName": "Drinkkimauste",
            "articleUUID": "7e5a186f-df5b-435b-8b48-3d9543774268",
            "saleArticleID": "7401",
            "quantity": 4500,
            "purchasePriceWithTax": 0,
            "purchaseTax": 14,
            "modifiedDate": "2022-01-24T10:16:25.549"
          },
          {
            "articleName": "Halpa viina 4 cl",
            "articleUUID": "301d239e-ecf1-4f3e-bdd1-6c9adaf63afb",
            "saleArticleID": "7770",
            "storageArticleID": "77701",
            "quantity": 1000,
            "usageUnit": "CL",
            "usageUnitInSIUnits": 10,
            "usageUnitsInBaseUnit": 70000,
            "baseUnit": "PLO",
            "baseUnitInSIUnits": 700,
            "baseUnitsInDeliveryUnits": 1000,
            "deliveryUnit": "PLO",
            "deliveryUnitInSIUnits": 1000,
            "purchasePriceWithTax": 1900,
            "purchaseTax": 24,
            "modifiedDate": "2022-01-24T10:16:25.559"
          }
        ],
        "articleLinkPriceType": "SUMMED_FROM_LINKS"
      }
    ]
  }
}
```

<a name="importarticles"></a>
### importArticles
Imports new and existing sale articles to Restolution. If several Restolution clients share the same API Key, the same articles will be imported identically to all clients. The optional property ``clientUUID`` will import the article only to the corresponding client.

<b>Note 1: All prices are given as cents.</b>

<b>Note 2: If a property is missing, it will not be changed or set at all. If a property is given with the value null, it will be set if possible. Sums cannot be null.</b>

<b>Note 3: Only sale articles can be imported. Thise corresponds to the ``SALE_ARTICLE`` in [Article main type](#article_maintype).

The sale articles to be imported are given as a list of [Extended Article (import)](#extendedarticle_import), used also in [getArticles](#getarticles) method. Importing supports only a subset of the properties in [Extended Article](#extendedarticle). The main reason is that many of the properties in [Extended Article](#extendedarticle) belong to other entities of Restolution and are managed separately. For example, importing an article with "priceListID": "1" requires that the price list with number "1" exists in Restolution. Refering to incorrect codes and IDs will raise errors and import will not succeed.

parameters:

* ``articles`` - array of [Extended Article (import)](#extendedarticle_import) objects

response:

A "savedArticles" object that contains the following fields:

* ``articles`` - nr of articles in request
* ``added`` - nr of new articles added
* ``updated`` - nr of existing articles updated
* ``clients`` - nr of clients affected

<a name="getstoragevalues"></a>
### getStorageValues
Gets all storage values from restolution. The storage values are returned as an array of [StorageValues](#storagevalue). The enpoint mimics the parameters and data in Storage Value Report in Restolution.

parameters:

*  ``saleDate`` - get storage values for this sale date. This parameter is required. 
*  ``showZeros`` - option to include also storage values for articles that do not have any recorded value in the database
*  ``calculateStartOfMonth`` - option to include the storage quantity at the start of the month of the given sale date
*  ``truncateStockValueCalc`` - option to use current purchase price of the article of each storage value instead of the purchase price calculated from storage transations (delivery notes)
*  ``businessUnitUUIDs`` - optional list of business unit UUID's whose storage values should be included. If this parameter is not given, the storage values of all business units will be included.

response:

* ``storageValues`` - array of StorageValue objects

sample request: 

```json
{
  "apiKey":"user_321683", 
  "timestamp": "2022-01-20T15:13:40.988Z",
  "requestID": "test_request_id",
  "method": "getStorageValues",
  "params": {
      "saleDate":"2022-01-01T03:00:00.000Z",
      "truncateStockValueCalc": true     
  }   
}
```

sample response:
```json
{
  "success": true,
  "timestamp": "2022-01-20T15:13:40.988Z",
  "requestID": "test_request_id",
  "response": {
    "storageValues": [
      {
        "clientUUID": "fba3d9ac-1bb6-49ea-a1cd-d147d6a7e233",
        "businessUnitUUID": "4a67c7a2-bbf6-4130-be16-f4f7b2571d92",
        "restaurantID": "10",
        "restaurantName": "Testiravintola",
        "storageName": "Testivarasto",
        "mainGroupID": "1",
        "mainGroupName": "Alko",
        "articleGroupID": "1",
        "articleGroupName": "Alko",
        "articleUUID": "2f86a72a-19db-46d3-9992-d82e866608f1",
        "articleName": "Viina",
        "storageArticleID": "1001",
        "quantity": 12500,
        "quantityInBaseUnits": 17857,
        "baseUnit": "PLO",
        "baseUnitInSIUnits": 700,
        "purchasePriceWithTax": 1438,
        "purchaseTax": 24
      },
      {
        "clientUUID": "fba3d9ac-1bb6-49ea-a1cd-d147d6a7e233",
        "businessUnitUUID": "4a67c7a2-bbf6-4130-be16-f4f7b2571d92",
        "restaurantID": "10",
        "restaurantName": "Testiravintola",
        "storageName": "Testivarasto",
        "mainGroupID": "1",
        "mainGroupName": "Alko",
        "articleGroupID": "1",
        "articleGroupName": "Alko",
        "articleUUID": "c6b1490c-d9d1-433e-8ca0-e6bef496afff",
        "articleName": "Gin",
        "storageArticleID": "1006",
        "quantity": 30,
        "quantityInBaseUnits": 43,
        "baseUnit": "PLO",
        "baseUnitInSIUnits": 700,
        "purchasePriceWithTax": 3231,
        "purchaseTax": 24
      },
{
        "clientUUID": "fba3d9ac-1bb6-49ea-a1cd-d147d6a7e233",
        "businessUnitUUID": "4a67c7a2-bbf6-4130-be16-f4f7b2571d92",
        "restaurantID": "10",
        "restaurantName": "Testiravintola",
        "storageName": "Testivarasto",
        "mainGroupID": "1",
        "mainGroupName": "Alko",
        "articleGroupID": "1",
        "articleGroupName": "Alko",
        "articleUUID": "ce1f4099-b587-4fca-a591-f98b45839ef4",
        "articleName": "Campari",
        "storageArticleID": "1011",
        "quantity": 300,
        "quantityInBaseUnits": 429,
        "baseUnit": "PLO",
        "baseUnitInSIUnits": 700,
        "purchasePriceWithTax": 2561,
        "purchaseTax": 24
      }
    ]
  }
}
```

<a name="listemployees"></a>
## listEmployees
For listing existing employees. The employees are listed as an array of [Employee](#employee) objects. 
If several Restolution clients share the same API Key, the same employee will be listed only once.

parameters:

currently no parameters are supported for this method

response:

* ``employees`` - array of [Employee](#employee) objects.


sample request:

```json
{
  "timestamp": "2015-09-16T08:58:40.988Z",
  "apiKey": "user_321681",
  "requestID": "test_request_id",
  "method": "listEmployees"
}
```

sample response:

```json
{
  "success": true,
  "timestamp": "2022-11-10T10:38:30.858Z",
  "requestID": "test_request_id",
  "response": {
    "employees": [
      {
        "employeeNumber": "123",
        "firstName": "Matti",
        "lastName": "Möttönen",
        "type": "EMPLOYEE"
      },
      {
        "employeeNumber": "234",
        "firstName": "Milla",
        "lastName": "Mallikas",
        "type": "MANAGER"
      }
    ]
  }
}
```

<a name="importemployees"></a>
## importEmployees
For importing new and existing employees. The employees are imported as an array of [Employee](#employee) objects. Only included values are updated to existing employees.
If several Restolution clients share the same API Key, the same employees will be imported identically to all clients.

parameters:

* ``employees`` - array of Employee objects
* ``clientNames`` - array of Client names of clients where the employees should be imported. Note: If this parameter is used, an imported employee can still have the clientName field to limit import of that particular employee to only one client, but the value has to be one of the clientNames values, otherwise an error will be returned.

response:

A "savedEmployees" object that contains the following fields:

* ``employees`` - nr of employees in request
* ``added`` - nr of new employees added
* ``updated`` - nr of existing employees updated
* ``clients`` - nr of clients affected

sample request:

```json
{
  "timestamp": "2022-11-09T08:58:40.988Z",
  "apiKey": "test_user",
  "requestID": "test_request_id",
  "method": "importEmployees",
  "params": {
    "employees": [
      {
        "employeeNumber": "123",
        "firstName": "Milla",
        "lastName": "Mallikas",
        "type": "MANAGER"
      },
      {
        "employeeNumber": "234",
        "firstName": "Matti",
        "lastName": "Meikäläinen",
        "type": "EMPLOYEE"
      }
    ]
  }
}
```

sample response:

```json
{
  "success": true,
  "timestamp": "2022-11-09T08:58:40.988Z",
  "requestID": "test_request_id",
  "response": {
    "savedEmployees": {
      "employees": 2,
      "added": 1,
      "updated": 1,
      "clients": 1
    }
  }
}
```

<a name="importtimetrackings"></a>
## importTimeTrackings
For importing new time trackings that represent performed work hours in a unit of a restaurant. The time trackings are imported as an array of [TimeTracking](#timetracking) objects. Each time tracking object has it's employee number and unit UUID and the import will update the time tracking of the clerk(s) in Restolution that are linked to the employee for the given unit. If any part of the imported time tracking (A) already exists for the clerk and unit in a previously stored time tracking (B), this part will be omitted, 
i.e. the[ _union_](https://brilliant.org/wiki/sets-union-and-intersection-easy/)  (A ∪ B) of the existing and the new time tracking period will be stored in Restolution.
If several Restolution clients share the same API Key, the time tracking import will affect all clients that have matching employee numbers and unit UUIDs. Note, however, that since the unit UUID is globally unique it is not possible for a single time tracking object to be imported to more than one unit (and client).

parameters:
* ```timeTrackings`` - array of [TimeTracking](#timetracking) objects 

response:

A "savedTimeTrackings" object that contains the following fields:

* ``timeTrackings`` - nr of time trackings in request
* ``added`` - nr of new time trackings added
* ``clients`` - nr of clients affected

sample request:

```json
{
  "timestamp": "2022-11-15T08:58:40.988Z",
  "apiKey": "user_321681",
  "requestID": "test_request_id",
  "method": "importTimeTrackings",
  "params": {
    "timeTrackings": [
      {
        "employeeNumber": "123",
        "unitUUID": "12abcbdb-0244-4820-8a2a-e85e874ec8c9",
        "startTime": "2022-11-08T07:00:00Z",
        "endTime": "2022-11-08T15:00:00Z"
      },
      {
        "employeeNumber": "234",
        "unitUUID": "12abcbdb-0244-4820-8a2a-e85e874ec8d5",
        "startTime": "2022-11-08T08:00:00Z",
        "endTime": "2022-11-08T16:00:00Z"
      }
    ]
  }
}
```
sample response:

```json
{
  "success": true,
  "timestamp": "2022-11-15T14:19:09.246Z",
  "requestID": "test_request_id",
  "response": {
    "savedTimetrackings": {
      "timeTrackings": 2,
      "added": 2,
      "clients": 1
    }
  }
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
## Campaign sub types

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

  <a name="article_maintype"></a>
### Article main type

* ``SALE_ARTICLE`` - A sale article that can be sold in a cash register.
* ``STORAGE_ARTICLE`` - A storage article that can be purchased and stored by a restaurant. The storage article cannot be sold, but used as contents in sale articles.
* ``SALE_STORAGE_ARTICLE`` - An article that has both sale and storage article properties.
* ``RECIPE_ARTICLE`` - A recipe article with a present amount and contents. To be used as part of a sale article.
* ``MESSAGE_ARTICLE`` - A message article can be used as part of an article message group for communication with the restaurant kitchen.

<a name="article_subtype"></a>
### Article sub type

* ``SIMPLE`` - A sale or storage article without contents. If it's a storage article it represents a raw ingredient.
* ``COMBINED`` - A sale article or storage article with content.
* ``LINK`` - A link sale article is a sale article that triggers sales of other articles.
* ``CONDIMENT`` - A condiment sale article is a modifier group that defines sale article choices made at the time of sale in the cash register.
* ``ORDER_STORAGE`` - A storage article that can only be ordered to the restaurant and not used in storage jobs. 
* ``COMBINED_CONDIMENT`` - A sale article with contents and condiment article properties.

<a name="article_link_pricetype"></a>
### Article Link Price type

* ``DEFINED_LOCALLY`` - Price is defined locally for the sale article
* ``SUMMED_FROM_LINKS`` - Price is the sum of the links
* ``SUMMED_FROM_LINKS_AND_LOCAL`` - Price is the sum of the links plus a local price for the sale article

<a name="employee-types"></a>
### Employee types

* ``EMPLOYEE`` - A normal employee
* ``MANAGER`` - A manager employee
* ``EXECUTIVE`` - An executive employee

     
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
| 20.12.2022 | mats.antell@restolution.fi	  | Added customerReceiptsOnly parameter to getReceipts |
| 19.04.2023 | mats.antell@restolution.fi         | Added salesReadUntilDate parameter to getReceipts |
| 20.04.2023 | mats.antell@restolution.fi         | Added cardCustomData1-3 to Receipt and getReceipts |
| 03.08.2023 | mats.antell@restolution.fi         | Added getBookkeepingRows changes for new parameter 'showMonthlyStorageData' |
| 08.08.2023 | mats.antell@restolution.fi	  | Added getDeliveryNotes and related objects |
| 08.08.2023 | mats.antell@restolution.fi	  | Added getArticles and related objects |
| 08.08.2023 | mats.antell@restolution.fi	  | Added importArticles and related objects |
| 08.08.2023 | mats.antell@restolution.fi	  | Added getStorageValues and related objects |
| 08.08.2023 | mats.antell@restolution.fi	  | Added getTransfers and related objects and some general naming consistency improvements |
| 08.08.2023 | mats.antell@restolution.fi	  | Added getWastages and related objects |
| 08.08.2023 | mats.antell@restolution.fi	  | Added getInventories and related objects |
| 08.08.2023 | mats.antell@restolution.fi	  | Added listEmployees and related objects |
| 08.08.2023 | mats.antell@restolution.fi	  | Added importEmployees |
| 08.08.2023 | mats.antell@restolution.fi	  | Added importEmployees and related objects |


