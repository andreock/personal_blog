---
layout: blog_article
title: Read EMV with PN532 
author: Andrea Canale
description: Explaining structure of EMV cards and how to read them using PN532 NFC module.
thumbnail: /emv_back.jpg
---

In this article, we will explore how is structureted an EMV cards and how to read it using the PN532 NFC module.

I tested the read of EMV using an Elechouse PN532 breakout board, other modules(also some cheap clone of Elechouse PN532) may not work due to poor antenna design.

## EMV Card Structure

EMV(Europay, MasterCard and Visa) is a global standard for credit and debit payment cards based on chip card technology. Originally it uses the ISO/IEC 7816 standard for contact cards, but it has been extended to support also contactless cards using NFC technology ISO/IEC 14443.

They are widely used for secure transactions in payment systems due to the usage of a chip that provides:
- A whole OS that manages applications and data
- Cryptographic functions for secure authentication and data encryption
- Tamper-resistant hardware  
- It can run Java applets called Java Card

It supports multiple applications on a single card, allowing for various payment methods and services to be integrated into one physical card.

The structure of an EMV card is based on a hierarchical file system, which consists of the following components:

1. **Master File (MF)**: The root directory of the card's file system. It contains references to all other files and directories on the card. Usually is not read directly since it doesn't contains useful data.
2. **Dedicated Files (DF)**: Subdirectories within the Master File that group related files together. Each DF can contain multiple Elementary Files (EF). These files are important to select the application on the card: it contains the PPSE(Payment System Environment) that returns the applications available on the card. It also return the ADF that contains the root of a specific application.
3. **Elementary Files (EF)**: The actual data files that store information such as card holder data, transaction history, and application data. It's contained within Dedicated Files and the terminal needs to know the AFL(Application File Locator) associated to files to read them.

Every information stored on the EMV card is organized using **Tag-Length-Value (TLV)** encoding. Each data element is represented by a tag (identifier), length (size of the data), and value (actual data). TLV encoding allows for flexible and efficient storage and retrieval of data on the card.

The communication with EMV cards is done using **Application Protocol Data Units (APDUs)**, which are standardized commands and responses defined by the ISO/IEC 7816 standard. APDUs are used to select files, read data, and perform various operations on the card.

The APDU follow this structure:

| CLA | INS | P1 | P2 | Lc | Data | Le |
|-----|-----|----|----|----|------|----|
| 1 byte | 1 byte | 1 byte | 1 byte | 1 byte | variable length | 1 byte |
- **CLA**: Class byte, indicates the type of command.
- **INS**: Instruction byte, specifies the command to be executed.
- **P1 and P2**: Parameter bytes, provide additional information for the command.
- **Lc**: Length of the command data.
- **Data**: Command data.
- **Le**: Length of expected response data. 0 means maximum length.

## Patching Adafruit PN532 library

Firstly we need to patch the Adafruit PN532 library to add support for EMV commands. You can find the patched library [here](https://github.com/andreock/Adafruit-PN532_Bruce/) but I will explain you the changes needed.

The method that PN532 uses to communicate with ISO14443A cards is `inDataExchange()`, but it support data exchange with listed tag and since EMV cannot be listed we need to send data to the first NFC tag in the PN532 field.

The `inDataExchange()` method have the following structure:

| D4 | 40 | Tg | DataOut | 
|----|----|------|-----| 

- **D4**: Start of frame for PN532
- **40**: InDataExchange command code
- **Tg**: Target (cards) to communicate with. 1 means the first card detected.
- **DataOut**: The actual data to be sent to the card.

We need to modify the method to force the Tg parameter to 1, so that we can communicate with the first card detected.

```c
pn532_packetbuffer[0] = 0x40; // PN532_COMMAND_INDATAEXCHANGE;
pn532_packetbuffer[1] = 1;
pn532_packetbuffer[2..n] = data;    // n can be up to 264 bytes(262 bytes of data)

// Send the command and check for ack
```

Now we must check the response from the card. The response from PN532 structure is as follows:

| D5 | 41 | Status | DataIn |
|----|----|------|-----|

- **D5**: Start of frame for PN532 response
- **41**: InDataExchange response code
- **Status**: Status byte indicating success or error.
- **DataIn**: The actual data received from the card.

The data from the EMV card have the following structure:

| Data  | SW1 | SW2 |
|------|------|------|

- **Data**: The actual data received from the card.
- **SW1 and SW2**: Status words indicating the result of the command.

We need to find the 0x90 0x00 byte sequence to identify the end of the data received from the card. If this sequence is not found, it means that an error occurred.

```c
// Check for PN532 status
    uint8_t length = 0;
    for (size_t i = 0; i < 240; i++) {
      if(pn532_packetbuffer[i] == 0x90 && pn532_packetbuffer[i+1] == 0x00) {
        Serial.println("Found finish");
        break;
      }
      length++;
    }
    length += 2;
// Other code from inDataExchange() method
```

So we calculate the length of the data received by iterating through the response buffer until we find the 0x90 0x00 sequence. We then add 2 to the length to account for the SW1 and SW2 bytes.

## Getting the application identifier

Before reading any data from an EMV card, it's important to select the card to activate the application associated with the data that we wanna read. Generally there are only an application per card, but some cards can have multiple applications installed.

An application is identified by its Application Identifier (AID), which is a unique identifier assigned to each application on the card. The AID is used to select the application and access its data. The AID also identify the card vendor, here's a list of common AIDs for major card vendors:

| Card Vendor     | AID (Hexadecimal)          |
|-----------------|----------------------------|
| MasterCard     | A0000000041010         |
| U.S Maestro    | A0000000042203         |
| Maestro        | A0000000043060         |
| Cirrus         | A0000000046000         |
| MasterCard     | A0000000049999         |
| Visa           | A0000000031010         |
| Electron       | A0000000032010         |
| V-Pay          | A0000000032020         |
| Visa           | A0000000033010         |
| Visa           | A0000000038010         |
| Visa           | A00000000980840        |
| American Express| A00000002501               |
| Discover        | A0000001523010             |
| JCB             | A0000000651010             |
| UnionPay        | A000000333010101           |

To select an application we can access to the DF called `2pay.sys.ddf01` that contains the PSE(Payment System Environment) used to get the AID, the select instruction have the following structure:

| 0x00 | 0xA4 | 0x04 | 0x00 | LC | Data | 0x00 |
|------|------|------|------|----|------|------|

- **0x00**: CLA byte, indicates the type of command(select).
- **0xA4**: INS byte, specifies the SELECT command.
- **0x04**: P1 parameter, indicates that we are selecting by name.
- **0x00**: P2 parameter, indicates that we want to select the first occurrence.
- **LC**: Length of the data field.
- **Data**: The name of the file to be selected(`2pay.sys.ddf01` in ASCII).
- **0x00**: Le byte, indicates that we want to receive the maximum length of the response.

Every SELECT command return an **FCI (File Control Information)** that contains information about the selected file.

```c
// Use BerTlv library: https://github.com/huckor/BER-TLV.git
std::vector<uint8_t> EMVReader::emv_ask_for_aid() {
    uint8_t uid[7];
    uint8_t len;
    uint8_t response[240];
    uint8_t response_len = 0;
    std::vector<uint8_t> aid;
    if (nfc->readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &len)) {  // Poll for a ISO14443A card
        uint8_t ask_for_aid_apdu[] = {0x00, 0xA4, 0x04, 0x00, 0x0e, 
                      //              2       p     a     y    .    s       y     s     .     d     d     f     0    1
                                      0x32, 0x50, 0x41, 0x59, 0x2e, 0x53, 0x59, 0x53, 0x2e, 0x44, 0x44, 0x46, 0x30, 0x31, 0x00};
        if (nfc->EMVinDataExchange(ask_for_aid_apdu, sizeof(ask_for_aid_apdu), response, &response_len)) {
            std::vector<uint8_t> response_vector(&response[0], &response[response_len]);
            BerTlv Tlv;
            Tlv.SetTlv(response_vector);
            if (Tlv.GetValue("4F", &aid) != OK) { // Application ID
                Serial.println("Can't get aid");
                aid.clear();
            }
            Serial.println("Get AID successfully");
        }
    }
    return aid;
}
```

With the AID we can navigate through the file system associated to that application and read the data stored on the card. AID is contained in the tag `4F` of the response. You can decode the BerTLV response from card using [TLV parser by emvlab.org](https://emvlab.org/tlvutils/).

## Selecting the application

Now, in order to access to the data associated to the application, we need to select it using the AID obtained in the previous step. This will give us access to the Application File Locator(AFL) that identify the files associated to that application.

This can be done by sending a SELECT command to the card with the AID as parameter. The SELECT command have the same structure as before, but now we use the AID obtained previously as file identifier.

```c
std::vector<uint8_t> EMVReader::emv_ask_for_pdol(std::vector<uint8_t> *aid) {
    uint8_t uid[7];
    uint8_t len;
    uint8_t response[240];
    uint8_t response_len = 0;
    std::vector<uint8_t> pdol;
                                          /* P1, P2,   LC */   /* --------------- AID -----------------*/  /* Le */
    uint8_t ask_for_pdol[] = {0x00, 0xa4, 0x04, 0x00, 0x07,    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,      0x00};
    memcpy(ask_for_pdol + 5, aid->data(), 7);

    if (nfc->EMVinDataExchange(ask_for_pdol, sizeof(ask_for_pdol), response, &response_len)) {
        std::vector<uint8_t> response_vector(&response[0], &response[response_len]);
        BerTlv Tlv;
        Tlv.SetTlv(response_vector);
        if (Tlv.GetValue("9F38", &pdol) != OK) { // PDOL(Some card doesn't have it)
            Serial.println("Can't get PDOL");
            pdol.clear();
        }
    }
    return pdol;
}
```

As you can see, some card send a PDOL at tag `9F38` with the response, this is a list of data objects that the terminal must provide to the card in order to proceed with the transaction(in our case to read data). Example of data requested are: transaction amount, date, currency and other information. I will proceed without it since MasterCard, for example, doesn't need it. [Here you can find the section for the PDOL(if you wanna read VISA card for example)](#Reading PDOL)

If the card doesn't send a PDOL, this call doesn't give any useful information to us apart from activating the application that we wanna read.

Example of a successfully call on a VISA card:

![Select](/personal_blog/emv_select.png)

## Getting the Application File Locator

To get the AFL, we need to send a GET PROCESSING OPTIONS command to the card. This command is used to retrieve the processing options for the selected application, including the AFL.

This commands have CLA `0x80` and INS `0xA8`. The command field is structured as following:

| 0x80 | 0xA8 | 0x00 | 0x00 | LM | 0x83 | DL | Data | 0x00 |
|------|------|------|------|----|------|----|------|------|

- **LM**: Length of the data field + 2(DL and Tag 0x83).
- **DL**: Length of the data field.

```c
std::vector<uint8_t> EMVReader::emv_get_processing_options_no_pdol() {
    uint8_t response[240];
    uint8_t response_len = 0;
    std::vector<uint8_t> afl;
    uint8_t ask_for_afl[] = {
        0x80,  // CLA
        0xa8,  // INS
        0x00,  // P1: Fixed to 
        0x00,  // P2: Fixed to
        0x02,  // Lc: Length of the data field + 2
        0x83,  // Indicate that we are sending PDOL
        0x00,  // Empty PDOL
        0x00   // Le: Expected length of the response(send 0 to get maximum length)
    }; // Get AFL

    if (nfc->EMVinDataExchange(ask_for_afl, sizeof(ask_for_afl), response, &response_len)) {
        std::vector<uint8_t> response_vector(&response[0], &response[response_len]);
        BerTlv Tlv;
        Tlv.SetTlv(response_vector);
        if (Tlv.GetValue("94", &afl) != OK) { // AFL
            Serial.println("Can't get AFL");
            afl.clear();
        }
    }
    return afl;
}
```

If all goes well, you will receive a similar response parsed:

![GET PROCESSION OPTIONS response](/personal_blog/gpo_response.png)

Some observations:

- Usually there are some junk bytes from PN532 that gives error during TLV parsing on website, you can ignore them since the C library doesn't complain most of time.
- The AFL is contained in the tag `94`.
- The response can contain the tag `57` (Track 2 Equivalent Data) that contains card number and expiration date in the following format: `CARDNUMBER-DY-YM-M...`. `D` is the separator, `Y` is year and `M` is month. You can parse it with the following bitwise trick: 

```c
// Index 9 is separator 'D' and first digit of ValidTo month
// Index 10 is second digit of ValidTo month and first digit of ValidTo year
// Index 11 is second digit of ValidTo year and first digit of Service Code
card->validto = (uint8_t *)malloc(2);
card->validto[0] = ((container[9] & 0x0F) << 4) + ((container[10] & 0xF0) >> 4);    // Isolate year
card->validto[1] = ((container[8] & 0x0F) << 4) + ((container[9] & 0xF0) >> 4);     // Isolate month
```

In this case you will not need to read the EF that contains card number and expiration date but you can explore it to find other interesting data, if the card have any.

## Read files using afl

Now that we have the AFL, we can read the files associated to the application. The AFL is a list of records that specify which files to read and how to read them. It is structured as follows:

| SFI | First Record | Last Record | Number of Records for auth |
|-----|--------------|-------------|------------------------------|

- **SFI (Short File Identifier)**: A unique identifier for the EF to be read.
- **First Record**: The first record number to be read from the file.
- **Last Record**: The last record number to be read from the file.
- **Number of Records for auth**: The total number of records that the file provides for authentication purposes, usually a generated cryptogram, verified by the bank online, that will authenticate a transaction, there is also a field for offline authentication. These records are needed for transactions performed by a real terminal that can contact the bank to perform the payment.

In our code, we will iterate through the AFL and read each record specified searching for PAN and issue/expire data. The READ RECORD command have the following structure:

| 0x00 | 0xB2 | Record Number | `(SFI << 3)` | 0x00 |
|------|------|---------------|-------------|------|

- **0x00**: CLA byte, indicates the type of command(read).
- **0xB2**: INS byte, specifies the READ RECORD command.
- **Record Number**: The record number to be read.
- **`(SFI << 3)`**: The SFI shifted left by 3 bits.
- **0x00**: Le byte, indicates that we want to receive the maximum length of the response.

The following code reads the AFL and extracts the PAN and validity dates from the records:

```c
void EMVReader::read_afl(EMVCard *card, std::vector<uint8_t> *afl) {
    for (size_t i = 0; i < afl->size(); i += 4) {
        uint8_t sfi = (afl->at(i) >> 3); // Get SFI from AFL entry
        uint8_t record_start = afl->at(i + 1);
        uint8_t record_end = afl->at(i + 2);

        std::vector<uint8_t> afl_content = emv_read_record(record_start, (sfi << 3) | 0b00000100);
        if (!afl_content.empty()) {
            BerTlv Tlv;
            Tlv.SetTlv(afl_content);
            std::vector<uint8_t> container;
            if (Tlv.GetValue("5A", &container) == OK) { // Get PAN(Credit Card Number).
                card->pan = (uint8_t *)malloc(container.size());
                memcpy(card->pan, container.data(), container.size()); // Copy data from TLV to struct
                card->pan_len = container.size();
                
                container.clear();
                
                if (Tlv.GetValue("5F25", &container) == OK) { // Get ValidFrom date
                    card->validfrom = (uint8_t *)malloc(2);
                    // The format in card is YEAR/MONTH but I want MONTH/YEAR since is the standard format
                    card->validfrom[0] = container[1];
                    card->validfrom[1] = container[0];
                } 
                
                container.clear();
                
                if (Tlv.GetValue("5F24", &container) == OK) { // Get ValidTo date
                    card->validfrom = (uint8_t *)malloc(2);
                    // The format in card is YEAR/MONTH but I want MONTH/YEAR since is the standard format
                    card->validfrom[0] = container[1];
                    card->validfrom[1] = container[0];
                }
                return; // Exit after finding PAN
            }
        } else {
            Serial.println("Can't parse AFL data");
        }
    }
}
```

- PAN will be contained in the tag `5A`.
- ValidFrom date will be contained in the tag `5F25`.
- ValidTo date will be contained in the tag `5F24`.
- They will be all in the same file.

## Reading PDOL

If this whole process seemed complicated to you (and it is), wait until you see the reading with the PDOL :)

If the card provides a PDOL in the SELECT response, we need to provide the requested data in order to proceed with the transaction. The PDOL is a list of data objects that the terminal must provide to the card. An example of PDOL is:

```c
const uint8_t pdol_example[] = {
  0x9F, 0x66, 0x04, // Terminal Transaction Qualifiers (4 bytes)
  0x9F, 0x02, 0x06, // Amount, Authorized (6 bytes)
  0x9F, 0x03, 0x06, // Amount, Other (6 bytes)
  0x9F, 0x1A, 0x02, // Terminal Country Code (2 bytes)
  0x95, 0x05,       // Terminal Verification Results (5 bytes)
  0x5F, 0x2A, 0x02, // Transaction Currency Code (2 bytes)
  0x9A, 0x03,       // Transaction Date (3 bytes)
  0x9C, 0x01,       // Transaction Type (1 byte)
  0x9F, 0x37, 0x04  // Unpredictable Number (4 bytes)
};
```

A PDOL data entry is structured as follows:

| Tag | Length |
|-----|--------|

- **Terminal Transaction Qualifiers (9F66)**: Indicates the capabilities of the terminal. For VISA I found that the value `0x200000` works fine.
- **Amount, Authorized (9F02)**: The amount authorized for the transaction. It's not important, you can set it to `0x0000000000`.
- **Amount, Other (9F03)**: The amount for other purposes. Same as before, set it to `0x0000000000`.
- **Terminal Country Code (9F1A)**: The numeric country code of the terminal. You can find a list of country codes [here](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes). For example for Italy is `380` so in hex is `0x0380`.
- **Terminal Verification Results (95)**: Results of terminal verification checks. Set it to `0x0000000000` to indicate a success.
- **Transaction Currency Code (5F2A)**: The currency code for the transaction. You can find a list [here](https://en.wikipedia.org/wiki/ISO_4217#List_of_ISO_4217_currency_codes) For Euro is `978`, so in hex is `0x0978`.
- **Transaction Date (9A)**: The date of the transaction. `0xdaymonthyear`, for example 2th Dicember 2025 is `0x021225`.
- **Transaction Type (9C)**: The type of transaction being performed. Set it to `0x00` for a purchase.
- **Unpredictable Number (9F37)**: A random number generated by the terminal. You can use any random value.

With all this information we can create the whole ADPU GET PROCESSING OPTIONS to send to the card:

```c
uint8_t payload[] = {
    // --- HEADER ---
    0x80,
    0xA8,
    0x00,
    0x00, // CLA, INS, P1, P2

    0x23, // Len: 35 bytes (0x23 Hex)

    // --- DATA FIELD ---
    0x83,
    0x21, // Payload len

    // Payload
    0x20,
    0x00,
    0x00,
    0x00, // 9F66 (TTQ - Visa Standard)
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00, // 9F02 (Amount 0)
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00, // 9F03 (Amount Other 0)
    0x03,
    0x80, // 9F1A (Country: Italy)
    0x00,
    0x00,
    0x00,
    0x00,
    0x00, // 95   (TVR: No errors)
    0x09,
    0x78, // 5F2A (Currency: Euro)
    0x25,
    0x11,
    0x25, // 9A   (Date: 25 Nov 25)
    0x00, // 9C   (Tx Type: Purchase)
    0x12,
    0x34,
    0x56,
    0x78, // 9F37 (Unpredictable Num)

    0x00 // Len of response expected by the card(0 means all)
};
```

You can now use this payload to send the GET PROCESSING OPTIONS command to the card, just like we did before without PDOL.

This will allow you to read the AFL and proceed with reading the files as we did before. Sometimes the card will return also the Track 2 Equivalent Data at tag `57` that contains card number and expiration date.

## Conclusion

I hope you enjoyed this article. Reading EMV cards can be a complex task due to the various commands and data structures involved but I found it really interesting to explore how they work under the hood. If you have any questions or want to share your experience with EMV cards, feel free to leave a comment in the Github discussion section of the blog!

### References

- Claude Sonnet 4.5 for most information about EMV structure and commands.
- [Werner Rothschopf article about EMV and PN532](https://werner.rothschopf.net/201703_arduino_esp8266_nfc.htm). It was the first article that I found about EMV and PN532, really good starting point besides it doesn't explain well all the part of EMV specification.
- [OpenSCDP](https://www.openscdp.org/scripts/tutorial/emv/reademv.html) To improve the definition of EMV structure and commands.
