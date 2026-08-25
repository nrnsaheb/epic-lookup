# EPIC Lookup

## Fast Electoral Roll EPIC Number Search

EPIC Lookup is a lightweight web-based tool created by **[Nooruddin Saheb](https://www.linkedin.com/in/nooruddinsaheb/)** for searching electoral-roll records using an EPIC number.

Enter an EPIC number to retrieve the corresponding available information, including:

- EPIC Number
- Part Number
- Name
- Relative Name
- Relative Type
- Serial Number
- Age
- Gender
- House Number

The website uses a lightweight EPIC index to identify the relevant source JSON file and serial number. Only the corresponding source JSON is then requested for the individual lookup.

---

# ⚠️ IMPORTANT DISCLAIMER

**THIS WEBSITE IS AN INDEPENDENT, INFORMATIONAL LOOKUP TOOL AND IS NOT AN OFFICIAL GOVERNMENT OR ELECTION COMMISSION WEBSITE.**

The information displayed by this website **must not be treated as an official electoral record, legal document, or proof of voter information.**

The underlying data may contain:

- OCR errors
- Missing information
- Incorrectly recognized names
- Outdated information
- Incomplete records
- Other data-processing errors

## VERIFY BEFORE RELYING ON ANY RESULT

**ALWAYS VERIFY THE DISPLAYED INFORMATION AGAINST THE OFFICIAL ELECTORAL ROLL OR THE RELEVANT GOVERNMENT SOURCE.**

In particular, **verify the result using the displayed Part Number and Serial Number against the corresponding official electoral-roll record.**

Do not rely solely on this website for:

- Voting eligibility
- Identity verification
- Address verification
- Legal purposes
- Government applications
- Electoral registration
- Any other official purpose

**The creator of this website does not represent the Election Commission of India, any State Election Commission, or any other government authority through this project.**

---

# About

Created by:

**[Nooruddin Saheb](https://www.linkedin.com/in/nooruddinsaheb/)**

This project was created to provide a simple and fast interface for locating available electoral-roll information using an EPIC number.

---

# How It Works

The website uses two levels of JSON data.

### 1. EPIC Index

The lightweight:

`epic_lookup_index_new.json`

contains mappings such as:

```json
{
    "JXW2252617": {
        "pdf": "2026-EROLLGEN-S10-45-SIR-DraftRoll-Revision1-ENG-1-WI.json",
        "serial": 9
    }
}
