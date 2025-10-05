"""
Словарь стран по регионам для фильтрации облигаций
Использует полные названия стран с заглавной буквы как в документации Terrapin API
"""

COUNTRIES_BY_REGION = {
    "Americas": [
        "United States of America", "Canada", "Brazil", "Mexico", "Argentina", 
        "Chile", "Colombia", "Peru", "Venezuela", "Ecuador", "Uruguay", 
        "Paraguay", "Bolivia", "Guyana", "Suriname", "French Guiana"
    ],
    "Europe": [
        "United Kingdom", "Germany", "France", "Italy", "Spain", "Netherlands", 
        "Switzerland", "Sweden", "Norway", "Denmark", "Finland", "Austria", 
        "Belgium", "Ireland", "Portugal", "Greece", "Poland", "Czech Republic", 
        "Hungary", "Romania", "Bulgaria", "Croatia", "Slovenia", "Slovakia", 
        "Lithuania", "Latvia", "Estonia", "Luxembourg", "Malta", "Cyprus"
    ],
    "Asia": [
        "China", "Japan", "India", "South Korea", "Singapore", "Hong Kong", 
        "Taiwan", "Thailand", "Malaysia", "Indonesia", "Philippines", 
        "Vietnam", "Bangladesh", "Pakistan", "Sri Lanka", "Myanmar", 
        "Cambodia", "Laos", "Mongolia", "Nepal", "Bhutan"
    ],
    "Pacific": [
        "Australia", "New Zealand", "Fiji", "Papua New Guinea", "Solomon Islands",
        "Vanuatu", "New Caledonia", "French Polynesia", "Samoa", "Tonga"
    ],
    "Middle East": [
        "Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait", 
        "Bahrain", "Oman", "Yemen", "Jordan", "Lebanon", "Syria", "Iraq", 
        "Iran", "Israel", "Palestine", "Egypt", "Turkey", "Cyprus"
    ],
    "Africa": [
        "South Africa", "Nigeria", "Egypt", "Morocco", "Kenya", "Ghana", 
        "Ethiopia", "Tanzania", "Uganda", "Sudan", "Algeria", "Angola", 
        "Congo", "Cameroon", "Ivory Coast", "Senegal", "Tunisia", "Zimbabwe"
    ],
    "USA": ["United States of America"],
    "United Kingdom": ["United Kingdom"],
    "European Union": [
        "Germany", "France", "Italy", "Spain", "Netherlands", 
        "Belgium", "Austria", "Ireland", "Portugal", "Greece", "Poland", 
        "Czech Republic", "Hungary", "Romania", "Bulgaria", "Croatia", 
        "Slovenia", "Slovakia", "Lithuania", "Latvia", "Estonia", "Luxembourg", 
        "Malta", "Cyprus"
    ],
    "Germany": ["Germany"],
    "France": ["France"],
    "Mainland China": ["China"],
    "India": ["India"],
    "Japan": ["Japan"]
}
