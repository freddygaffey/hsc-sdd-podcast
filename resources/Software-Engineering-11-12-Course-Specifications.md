# Higher School Certificate Course Specifications — Software Engineering

NSW Education Standards Authority

Updated November 2024

© 2023 NSW Education Standards Authority. NESA acknowledges Traditional Owners and Custodians of Country throughout NSW, and pays respect to Elders past and present. NESA recognises Aboriginal Peoples' continuing Cultures and Connections to lands, waters, skies and Community.

---

## Table of contents

- [Introduction](#introduction)
- [System and Data Modelling Tools](#system-and-data-modelling-tools)
  - [Data flow diagrams](#data-flow-diagrams)
  - [Structure charts](#structure-charts)
  - [Data dictionary](#data-dictionary)
  - [Class diagrams](#class-diagrams)
  - [Storyboard](#storyboard)
  - [Decision trees](#decision-trees)
- [Project Management Tools](#project-management-tools)
  - [Gantt charts](#gantt-charts)
  - [Process diaries / log books](#process-diaries--log-books)
- [Programming Paradigms](#programming-paradigms)
  - [Object-oriented paradigm](#object-oriented-paradigm)
  - [Logic paradigm](#logic-paradigm)
  - [Imperative paradigm](#imperative-paradigm)
  - [Functional paradigm](#functional-paradigm)
- [Algorithms](#algorithms)
  - [Pseudocode](#pseudocode)
  - [Flowcharts](#flowcharts)
- [Control Structures](#control-structures)
  - [Sequence](#sequence)
  - [Selection](#selection)
  - [Repetition](#repetition)
- [Subroutines](#subroutines)
- [Relational Databases](#relational-databases)
  - [SQL](#sql)
  - [Object-Relational Mapping (ORM)](#object-relational-mapping-orm)
- [Wiring diagrams for mechatronic systems](#wiring-diagrams-for-mechatronic-systems)
- [Programming for the Web](#programming-for-the-web)
  - [Front-end web development frameworks](#front-end-web-development-frameworks)
  - [Cross-site scripting](#cross-site-scripting)
  - [Cascading Style Sheets (CSS)](#cascading-style-sheets-css)
- [Machine Learning](#machine-learning)
  - [Machine learning automation through DevOps](#machine-learning-automation-through-devops)
  - [Regression algorithms](#regression-algorithms)
  - [Neural Networks](#neural-networks)
- [Methods for Testing a System](#methods-for-testing-a-system)
- [Character Representation](#character-representation)
- [Programming with Python](#programming-with-python)

---

## Introduction

Software Engineering Course Specifications are an integral part of the course content for Year 11 and Year 12 and indicate the depth of study required for some concepts in the Software Engineering 11–12 Syllabus. The Software Engineering 11–12 Syllabus must be applied in conjunction with the Software Engineering Course Specifications.

---

## System and Data Modelling Tools

### Data flow diagrams

#### Symbols

| Symbol | Meaning |
| --- | --- |
| Circle labelled "Process" | A circle represents a process. A process uses input(s) to generate output(s). |
| Rectangle (open-ended box) labelled "Data store" | A data store can be an electronic file or non-computer storage. |
| Rectangle labelled "External entity" | An external entity can be any person, organisation or element that provides data to the system or receives data from the system. |
| Curved arrow labelled "Data flow" | A labelled, curved arrow represents the flow of data between processes, data stores and external entities. |

The following data flow diagram models a voting system.

> **Diagram: Voting system data flow diagram.** External entities *Candidates* and *Voters* are boxes; processes *Nomination process*, *Voting* and *Results* are circles; *Endorsed candidates* is a box (data store), and *Electoral roll* is a box (data store). Flows: Candidates → Nomination process ("Candidates' details"); Nomination process → Endorsed candidates ("Successful candidates' details"); Endorsed candidates ↔ Voting ("List of candidates" / accumulated votes); Voters ↔ Voting ("Voters' details and vote" / "Confirmation"); Voting ↔ Electoral roll ("Voters' details" / "Already voted or Vote accepted"); Endorsed candidates → Results ("Candidates' details and accumulated votes"); Results → Public ("Election results").

#### Level 0 data flow diagram

Level 0 data flow diagrams represent an overview of the entire system and do not show data stores or internal processes. The following represents a Level 0 data flow diagram for the voting system.

> **Diagram: Level 0 data flow diagram for the voting system.** Three external entities (*Candidates*, *Voters*, *Public*) surround a single process circle, *Voting*. Flows: Candidates → Voting ("Candidates' details"); Voters ↔ Voting ("Voters' details and vote" / "Confirmation"); Voting → Public ("Election results").

### Structure charts

Structure charts represent a system by showing the separate subroutines that make up the system and their relationship to each other.

#### Symbols

| Symbol | Meaning |
| --- | --- |
| Empty circle on a connecting line | Indicates data movement between subroutines (usually passed as parameters). |
| Filled (solid) circle on a connecting line | Indicates a flag or control variable that is passed between subroutines. |
| Small diamond at the intersection of connecting lines | Indicates a decision — ie optional execution of a subroutine, as a result of a binary or multi-way selection. The diamond may instead appear on a single connecting line if calling that subroutine is optional. |
| Curved arrow looping back on a connecting line | Indicates repetition — execution of a particular subroutine or set of subroutines multiple times. |

The following structure chart represents a library system:

> **Diagram: School library system structure chart.** Top box *School library system* branches (via a decision diamond labelled "Until library closes") into *Borrowing* and *Returning*.
> - *Borrowing* branches into *Validate student information* (passing "Valid student information" flag) and, via a decision/repeat ("Until no more books") into *Process books*, which in turn branches into *Book information* (passing "Book ID" data and "Book available" flag) and *Update book and student files* (passing "Book ID" and "Student ID" data).
> - *Returning* branches into *Check book* (passing "Book details" data and "Overdue flag"), *Update files* (passing "Student details" and "Book details" data and "Overdue flag"), and *Reports* (passing "Student details" and "Book details" data). *Check book* further branches into *Locate book record* (passing "Book details" data and "Date due" data) and *Check if overdue* (passing "Date due" data and "Overdue flag").

Further detail for each of the lower-level subroutines can be shown in a separate structure chart, using the same name as the subroutine used in the main structure chart.

This method of providing successively more detail as required is known as **refinement**.

### Data dictionary

A data dictionary provides a comprehensive description of each variable stored or referred to in a system. This commonly includes variable name, data type, format, size in bytes, number of characters to display the item including number of decimal places (if applicable), the purpose of each variable and a relevant example. Any validation rules applicable to the data item can also be included.

Details of records or arrays of records can be included in data dictionaries.

An extract of a data dictionary is shown:

| Variable | Data type | Format for display | Size in bytes | Size for display | Description | Example | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UserId | String | XXNNN | 5 | 5 | A primary key, uniquely identifies user. First 2 letters of surname followed by unique 3-digit identifier | PT173 | First 2 characters letters, followed by last 3 characters digits |
| UserName | String | XX..XX | 15 | 15 | Username of employee | Kim | First letter is a capital letter |
| DOB | Date and Time | YYYY/MM/DD | 4 | 10 | Birth date of employee | 1953/10/05 | Valid date less than today |
| Times_Late | Integer | NNN | 2 | 3 | Number of times late to work this year | 147 | Integer between 0 and 999 |
| PayRate | Floating Point | $NNN.NN | 4 | 7 | Hourly rate of pay | $124.37 | Decimal greater than 20, less than 400 |
| SocialClub | Boolean | X | 1 bit | 1 | Y or N | N | |
| Departments | Array (string) | | 20 * number of departments | N/A | Names of departments in organisation | Administration, Finance, Marketing | From a drop-down list |

**Note:** a date and time data type is always stored as 32 bits (4 bytes) and can be displayed using different formats such as `DD/MM/YYYY hh:mm:ss` or `YYYY/MM/DD`.

### Class diagrams

Class diagrams provide a visual representation of systems that are implemented using the object-oriented paradigm. They model classes, their attributes and methods, and the relationships between classes.

#### Symbols

| Box layout | Meaning |
| --- | --- |
| Three-row box: class name / attribute(s) / method(s) | The standard class diagram box. |

| Arrow / notation | Meaning |
| --- | --- |
| Solid line, hollow/unfilled triangular arrowhead | Inheritance |
| Solid line, open (line) arrowhead | Relationship |
| `1..1` | Only one |
| `0..*` | Zero or more |
| `1..*` | One or more |
| `0..1` | Zero or only one |
| `m..n` | At least m, at most n (m ≤ n) |

The following is an example of a class diagram:

> **Diagram: Class diagram.** `Person` (attributes: `firstName: string`, `lastName: string`; method: `printFullName()`) is the parent class. `Student` (attributes: `studentID: int`, `homeroom: string`; method: `enrolClass()`) and `Parent` (attributes: `occupation: string`, `alumni: boolean`) both inherit from `Person`. `Subject` (attributes: `studentID: int`, `subjectName: string`; method: `printStudentList()`) has a "studies" relationship with `Student`: a `Student` is linked to `1..*` `Subject`, and a `Subject` is linked to `0..*` `Student`.

**Note:** Both `Student` and `Parent` inherit from `Person`. There is a relationship between `Student` and `Subject`. A student must study 1 or more subjects. A subject can have 0 or more students enrolled.

### Storyboard

A storyboard shows the various interfaces (screens) as well as the links between them.

The following storyboard shows the relationship between three pages of information aimed at promoting a school canteen on a website.

> **Diagram: Storyboard for a school canteen website.** Three screen mock-ups are linked by curved arrows: **School Canteen** (nav: Home, Prices, Specials, Exit; content: "Information" text and an "Image of canteen" placeholder) links to **Specials** (nav: Home, Prices, Specials, Exit; content: "Description of specials") and to **Prices** (nav: Home, Prices, Specials, Exit; content: "Price list" table). Each page's current screen is highlighted in its nav (eg "Home" highlighted on the School Canteen page, "Specials" highlighted on the Specials page, "Prices" highlighted on the Prices page), and arrows show navigation between all three pages.

### Decision trees

A decision tree is a diagram that represents all possible combinations of decisions and their resulting actions. Branches are shown to describe the eventual action depending on the condition at the time. Each decision path will lead to either another decision or a final action.

The following decision tree shows the rules in controlling the temperature system within a 'smart' house:

| Inside temperature | Humidity | Fan | Cooling | Heating | Window |
| --- | --- | --- | --- | --- | --- |
| > 30°C | > 50% | High | On | Off | Closed |
| > 30°C | ≤ 50% | Medium | On | Off | Closed |
| 15–30°C | > 50% | Medium | On | Off | Closed |
| 15–30°C | ≤ 50% | Medium | Off | Off | Open |
| < 15°C | > 50% | Low | Off | Off | Open |
| < 15°C | ≤ 50% | Medium | Off | On | Closed |

The following diagram shows another way to represent a decision tree:

> **Diagram: Car-purchase decision tree.** Root decision: `Mileage < 10 000 km`? **Yes** → `Type = SUV`? **Yes** → *Buy*. **No** → `Colour = Silver`? **Yes** → *Buy*. **No** → *Do not buy*. **No** (mileage not < 10,000 km) → `Type = SUV`? **Yes** → *Buy*. **No** → `Optional Accessories`? **Yes** → *Buy*. **No** → *Do not buy*.

---

## Project Management Tools

### Gantt charts

A Gantt chart displays each of the component tasks in a proposed system development on an estimated timeline. Tasks should be named with self-explanatory titles. The estimated time required for each task and its dependent tasks should be clearly shown. The time scale should be clearly indicated with dates and important milestones in the project clearly marked.

The following diagram shows the main elements of a Gantt chart. Other formats are acceptable.

> **Diagram: Example Gantt chart** with an ID/Task name table down the left and a date timeline (30–31 Aug, 1–16 Sept) across the top. Tasks, each shown as a horizontal bar across its date range, with dependency arrows linking the end of one bar to the start of the next:
> 1. Interview participants
> 2. Collate interview results (depends on 1)
> 3. Document participant needs (depends on 2)
> 4. Identify system processes
> 5. Identify data/information needs (depends on 4)
> 6. Produce a data flow diagram (depends on 3 and 5)
> 7. Produce a requirements report (depends on 6)
> 8. Requirements milestone (diamond marker, depends on 7)

Gantt charts can also be used to allocate resources, including team members, to specific tasks. The following chart shows the percentage completion of tasks by each team member. Charts should be regularly updated during development to reflect actual versus estimated times for tasks.

> **Diagram: Resource-allocated Gantt chart** with columns for Task name and Planned start date, and a weekly timeline (31 Oct – 5 Dec 2022) showing percent-complete bars per task, each annotated with the assigned team member's name, eg:
> - **1. Analysis (69%)** — On-site meetings; Discussions with... (90%) → Stakeholder Requirement 1 (100%, Sara McLoy and Maria Hughs), Stakeholder Requirement 2 (100%); Customer Requirement 1 (50%); Document Current Systems (0%, James Larry and Maria Hughs); Analysis complete milestone (10-11-2022).
> - **2. Design (0%)** — Design database (0%, Maria Hughs); Software Design (0%, Rebecca McCabe); Interface design (0%); Create design spec. (0%, Danny Lee); Design complete milestone (24-11-2022).
> - **3. Development** — Deploy Development; Develop System Modules (0%, Steven); Integrate System Modules (0%).

### Process diaries / log books

Process diaries / log books are used to document the progress of a project. Entries made by team members at regular intervals should include:

- date
- person making the entry
- progress since the last entry
- tasks achieved
- stumbling blocks or issues encountered and how they were managed
- possible approaches for upcoming tasks
- reflective comments
- resources used.

---

## Programming Paradigms

### Object-oriented paradigm

Students should know how to:

- define classes, objects, attributes and methods
- make use of inheritance, polymorphism and encapsulation
- perform message passing
- use control structures and variables.

### Logic paradigm

Students should know how to:

- define and edit facts
- create, edit and remove rules
- display the solution and the rules that the system used.

### Imperative paradigm

Students should know how to:

- use control structures and variables
- use assignment statements
- use expressions
- use subroutines.

### Functional paradigm

Students should know how to:

- call functions and use recursion
- use functions as first-class objects and collections
- use abstraction, encapsulation, inheritance and polymorphism.

**Note:** Students should know how to use appropriate data structures for each of the paradigms.

---

## Algorithms

It is expected that students are able to develop and interpret algorithms represented as pseudocode and flowcharts.

It is important to start complex algorithms with a clear, uncluttered mainline. The mainline should reference required subroutines, the details of which are shown in separate algorithms.

Each subroutine should be concise and correctly make use of further subroutines for detailed logic.

### Pseudocode

Pseudocode is a method of describing the logic in an algorithm. It makes use of capitalised keywords and indentation to show control structures used.

In pseudocode:

- keywords are written in capitals
- structural elements come in pairs, eg for every `BEGIN` there is an `END`, for every `IF` there is an `ENDIF`
- indenting is used to identify control structures in the algorithm
- when refining the solution to a problem, a subroutine can be referred to in an algorithm by its name, with a separate subroutine developed with that same name to show the detailed logic.

### Flowcharts

Flowcharts are diagrams that represent algorithms and are read from top to bottom and left to right.

#### Symbols

| Shape | Meaning |
| --- | --- |
| Rectangle with vertical bars at each side | subprogram |
| Parallelogram | input or output |
| Rounded rectangle / oval | terminator |
| Rectangle | process |
| Diamond | decision |

Flowcharts using these symbols should be developed using only the standard control structures (as described in the following section, Control Structures).

---

## Control Structures

Algorithms are developed using the basic control structures of sequence, selection and repetition. Students are expected to design algorithms and write code incorporating combinations of these control structures.

### Sequence

Sequence refers to steps which are to be executed one after the other. The steps are executed in the same order in which they are written.

**Pseudocode:**

```
process 1
process 2
…
…
process n
```

**Flowchart:** a single vertical chain of process boxes: `process 1` → `process 2` → `...` → `process n`.

### Selection

#### Binary selection

In binary selection, if the condition is met then one path is taken, otherwise the second possible path is followed.

**Pseudocode (1):**

```
IF condition THEN
    process 1
ENDIF
```

**Flowchart (1):** a decision diamond labelled `condition`; **False** flows straight through; **True** flows to `process 1`; both paths rejoin below.

**Pseudocode (2):**

```
IF condition THEN
    process 2
ELSE
    process 1
ENDIF
```

**Flowchart (2):** a decision diamond labelled `condition`; **False** flows to `process 1`; **True** flows to `process 2`; both paths rejoin below.

**Note:** Arrows coming from a decision symbol should be labelled to remove ambiguity.

#### Multi-way selection

In multi-way selection there can be a number of possible choices, or cases. The path taken is determined by the evaluation of the expression. Once a relevant path has been determined and executed, execution of this expression ceases. Only one process is executed as a result of the implementation of the multi-way selection.

Multi-way selection is often referred to as a **case structure**.

**Pseudocode:**

```
CASEWHERE expression evaluates to
    choice a: process a
    choice b: process b
    …
    OTHERWISE: default process
END CASE
```

**Flowchart:** a decision diamond labelled `expression` branches into `choice a` → `process a`, `choice b` → `process b`, and `otherwise` → `default process`; all paths rejoin below.

#### Nested IF

A nested IF allows the testing of multiple conditions with only one process executed.

**Pseudocode:**

```
IF condition A THEN
    process 1
ELSEIF condition B THEN
    process 2
ELSEIF condition C THEN
    process 3
ELSE
    process 4
ENDIF
```

**Flowchart:** decision diamond `condition A` — **True** → `process 1`; **False** → decision diamond `condition B` — **True** → `process 2`; **False** → decision diamond `condition C` — **True** → `process 3`; **False** → `process 4`. All paths rejoin below.

### Repetition

#### Pre-test

The pre-test loop tests the condition at the start of the loop to determine whether the body of the loop is executed. The body of the loop is executed repeatedly while the termination condition is true.

**Pseudocode:**

```
WHILE condition is true
    process
ENDWHILE
```

**Flowchart:** decision diamond `condition` — **True** → `process`, looping back to the `condition` check; **False** → exits the loop.

#### Post-test

A post-test loop executes the body of the loop before testing the termination condition. The body of the loop is repeatedly executed until the termination condition is true.

**Pseudocode:**

```
REPEAT
    process
UNTIL condition is true
```

**Flowchart:** `process 1` executes, then decision diamond `condition` is checked — **False** loops back to `process 1`; **True** exits the loop.

#### FOR / NEXT

FOR / NEXT loops (also known as counted loops) can be regarded as special cases of repetition and, depending on the language, are implemented as either pre-test or post-test repetitions.

**Pseudocode:**

```
FOR variable = start TO finish STEP increment
    statements
NEXT variable
```

**Flowchart:** `variable = start` → decision diamond `variable > finish?` — **Yes** exits the loop; **No** → `Statements` → `Add increment to variable` → loops back to the decision check.

**Note:** Increment can take either a positive or negative value. The flowchart shows the logic for a positive increment.

---

## Subroutines

The terms subroutine, module, subprogram and procedure can be used interchangeably to represent a collection of statements that achieve a specific purpose.

A subroutine can do the same task at different points in an algorithm. It may operate on different data each time it is called. One or more parameters are used to indicate the data to be processed.

A function is a particular type of subroutine that returns a single value.

### Using a subroutine with one parameter

The following algorithms represent the logic required to fill an array with characters.

The subroutine `read` uses a single parameter `arrayname` that can take different values.

The first time that this subroutine is called, the data is read and stored in the array called 'name'. The second time, the data is read and stored in the array called 'address'.

**Pseudocode:**

```
BEGIN
    read (name)
    read (address)
END
```

**Flowchart:** `BEGIN` → `Read (name)` → `Read (address)` → `END`.

**Pseudocode (subroutine `read`):**

```
BEGIN read (arrayname)
    Set pointer to first position
    Get a character
    WHILE more data AND space in array
        Store data in arrayname at the position given by the pointer
        Increment the pointer
        Get next character
    ENDWHILE
END read (arrayname)
```

**Flowchart:** `BEGIN read (arrayname)` → `Set pointer to first position` → `Get a character` → decision diamond `More data and room in the array?` — **True** → `Store character in next position in the array` → `Increment pointer` → `Get next character` → loops back to the decision; **False** → `END read (arrayname)`.

### Using a subroutine with multiple parameters

The following algorithms represent the logic required to display the sum of two consecutive integers, where the smaller integer takes all possible values from 1 to 5. The subroutine `Add` uses three parameters, `x`, `y` and `total`.

**Pseudocode:**

```
BEGIN AddNumbers
    FOR i = 1 to 5
        Add (i, i + 1, sum)
        Display sum
    NEXT i
END AddNumbers
```

```
BEGIN Add (x, y, total)
    total = x + y
END Add (x, y, total)
```

**Flowchart (`AddNumbers`):** `BEGIN AddNumbers` → `i = 0` → decision diamond `i = 5?` — **True** exits to `END AddNumbers`; **False** → `i = i + 1` → `Add (i, i + 1, Sum)` → `Display Sum` → loops back to the decision check.

**Flowchart (`Add`):** `BEGIN Add (x, y, total)` → `total = x + y` → `END Add (x, y, total)`.

### Passing a value back from a function

A function generates a single value. The word `RETURN` is used to pass this single value back from the function.

The algorithm `Addnumbers` uses the function `Add` to calculate the sum of two consecutive integers where the smaller integer takes all possible values from 1 to 5. In this case the function requires two parameters.

**Pseudocode:**

```
BEGIN Addnumbers
    FOR i = 1 to 5
        Display Add (i, i + 1)
    NEXT i
END Addnumbers
```

```
BEGIN Add (x, y)
    total = x + y
    RETURN total
END Add (x, y)
```

**Flowchart (`Addnumbers`):** `BEGIN Addnumbers` → `i = 0` → decision diamond `i = 5?` — **True** exits to `END Addnumbers`; **False** → `i = i + 1` → `Display Add (i, i+1)` → loops back to the decision check.

**Flowchart (`Add`):** `BEGIN Add (x, y)` → `total = x + y` → `RETURN total` → `END Add (x, y)`.

---

## Relational Databases

### SQL

Structured Query Language (SQL) is a language used to access and manipulate data in relational databases.

For the HSC Software Engineering course, the following syntax is used:

```
SELECT     the field(s) or calculated values to be displayed
FROM       the table(s) to be used
WHERE      the search criteria
GROUP BY   the field(s) used to group the returned rows
ORDER BY   the field(s) that determine the sequence of the displayed results
```

The keyword `AS` may be used within a `SELECT` statement to rename fields for display.

The search criteria may use relational operators, including the following:

```
CONTAINS
DOES NOT CONTAIN
EQUALS
NOT EQUAL TO
GREATER THAN
GREATER THAN OR EQUAL TO
LESS THAN
LESS THAN OR EQUAL TO
```

Logical operators that may be used include the following:

```
AND
OR
NOT
```

If the `GROUP BY` clause is used, it is useful to include in the `SELECT` statement details of the value to be calculated. The following functions may be used:

```
SUM (attribute)
AVG (attribute)
COUNT (attribute)
MAX (attribute)
MIN (attribute)
```

If the `ORDER BY` clause is used, the field and method should be specified. The methods used are typically identified by `ASC` (ascending: A – Z or 0 – 9) or `DESC` (descending: Z – A or 9 – 0).

Three tables from a relational database are shown:

> **Diagram: Entity-relationship layout.** `Games` (ID (P), Name, Release_date, Cost, Publisher_ID (F), Developer_ID (F)) relates to `Publishers` (Publisher_ID (P), Name) with a many-to-one relationship (∞ to 1), and to `Developers` (Developer_ID (P), First_name, Last_name) with a many-to-one relationship (∞ to 1). P = Primary key, F = Foreign key.

The following query displays the name and release date of all games released from 1 March 2022 to 31 March 2023. The results will be displayed in ascending alphabetical order by game name.

```sql
SELECT Name, Release_date
FROM Games
WHERE Release_date >= '01/03/2022' AND Release_date <= '31/03/2023'
ORDER BY Name ASC
```

The following query displays each developer, together with the total cost of games they have developed for the publisher 'Games Inc', listed in descending order of developer name.

```sql
SELECT Developers.First_name, Developers.Last_name, SUM (Games.cost) AS Totalcost
FROM Games, Publishers, Developers
WHERE Publishers.Name = 'Games Inc'
AND Publishers.Publisher_ID = Games.Publisher_ID
AND Developers.Developer_ID = Games.Developer_ID
GROUP BY Developers.Developer_ID
ORDER BY Developers.Last_name DESC
```

### Object-Relational Mapping (ORM)

ORM (Object-Relational Mapping) provides a layer of abstraction between the database and the programming language which the developer is using. In an object-oriented language, an ORM will usually be able to represent database items (rows) as objects in that chosen language and the attributes of that item (columns) as properties of the object. Students are expected to interpret code fragments used in an ORM framework.

---

## Wiring diagrams for mechatronic systems

Mechatronic systems can range in complexity and can be represented using the following symbols.

| Name | Symbol description |
| --- | --- |
| Capacitor | Two parallel lines perpendicular to the connecting wire (eg "C 10 F") |
| Diode | Triangle pointing toward a bar across the wire |
| Resistor | Zigzag line (eg "R 100 Ω") |
| 2-way Switch | Two terminals with a pivoting arm that can connect to either |
| On/off Switch | Two terminals with a single pivoting arm/break in the line |
| Speaker | Box with an attached cone/triangle shape |
| Motor | Circle containing "M" |
| LED | Diode symbol with arrows radiating outward (indicating emitted light) |
| Lightbulb | Circle with an internal "X" / filament cross |
| Integrated circuit | Rectangle with numbered pins on both sides (eg "IC 1000" with pins 1–8) |
| Voltage source | Circle with "+" and "−" terminals and a voltage value (eg "10 V") |
| DC Voltage Source | Two unequal parallel lines (battery symbol) with a voltage value (eg "10 V") |
| DC Voltage source (alt.) | Multiple unequal parallel lines (multi-cell battery symbol) with a voltage value (eg "10 V") |
| Amplifier | Triangle shape labelled "Amplifier" |

If a wiring diagram requires other electrical components, the components must be clearly labelled for identification.

---

## Programming for the Web

### Front-end web development frameworks

There are numerous front-end web development frameworks which provide different features and benefits. Students should understand why such frameworks are useful in front-end web development.

Students are not expected to have knowledge of a specific framework nor are they expected to code using any specific framework.

### Cross-site scripting

Cross-site scripting (XSS) involves injecting malicious code into an otherwise safe website. It is usually done through user input that is not sufficiently sanitised before being processed and stored on the server.

Students should be able to interpret fragments of JavaScript related to cross-site scripting.

### Cascading Style Sheets (CSS)

Cascading style sheets (CSS) are used to describe the formatting of web pages. Students are expected to interpret code fragments written in CSS and HTML. The following syntax is used:

```css
/* Comment */
selector {
    property: value;
}
```

- **Comments:** can be specified anywhere in CSS and are enclosed in `/*` and `*/`
- **Selector:** targets a particular HTML element on the page to which the styling within the braces should be applied
- **Property:** a styling property, such as `color`
- **Value:** the value of the styling property, such as `red`

The following HTML fragment shows the CSS to style a webpage.

```html
<html>
   <head><title>My Website</title></head>
   <body>
      <h1>Welcome!</h1>
      <p id="welcome">Welcome to my website!</p>
      <p class="red-text">This text should be red</p>
      <p>My website also has <span class="red-text">red text</span> here</p>
   </body>
</html>
```

The CSS to style that page is as follows.

```css
/* This selector targets an HTML element */
h1 {
   font-size: 18px;
}

/* This selector targets an HTML element with a specific "id" */
#welcome {
   font-style: italic;
}

/* This selector targets an HTML element with a specific "class" */
.red-text {
   color: red;
}
```

---

## Machine Learning

### Machine learning automation through DevOps

MLOps is the automated process of designing, training and deploying machine learning models. It borrows many of the same principles and practices used in DevOps, bringing together the teams involved in developing machine learning models and the operational teams involved in deploying and supporting the models in production.

Students should know the three stages of MLOps.

> **Diagram: MLOps cycle.** Three connected circles in sequence, each with bidirectional arrows looping back into itself and forward to the next: **Design** → **Model Development** → **Operation**.

- **Design:**
  - defining the business problem to be solved
  - refactoring the business problem into a machine learning problem
  - defining success metrics
  - researching available data.
- **Model development:**
  - data wrangling
  - feature engineering
  - model training
  - model testing and validation.
- **Operations:**
  - model deployment
  - supporting operations/use
  - monitoring model performance.

### Regression algorithms

Linear regression and polynomial regression algorithms are used to predict values in a continuous range, such as integers. These regression algorithms are used for machine learning.

Logistic regression is used for classification problems.

Students should know how to design programs which use and apply these algorithms but are not expected to implement (or code) these complex algorithms.

The following Python code represents linear regression using NumPy and Scikit-learn machine learning frameworks.

```python
# Import frameworks
import numpy
from sklearn.linear_model import LinearRegression

# Create the data for the two features
x = np.array([[2], [4], [6], [8], [10], [12], [14], [16]])
y = np.array([1, 3, 5, 7, 9, 11, 13, 15])

# Create the model
model = LinearRegression()

# Fit the model to the data (that is determine the line of best fit through the data)
model.fit(x, y)

# We can now use the model for predictions with existing or new data
# The model expects a value for x and will predict a value for y – so if we asked for a
# prediction on 4 it would return 3 (as that is known data).
y_prediction = model.predict(4)
>> 3

# If we asked for a prediction of 4.5 it should return 3.5 (even though that is unknown
# data we can tell what it should return, given there is a linear relationship)
y_prediction = model.predict(4.5)
>> 3.5
```

### Neural Networks

> **Diagram: Neural network.** Three regions: an *Input layer* (5 nodes, "responding to inputs") on the left, a *Hidden layer* (5 nodes) in the middle, and *Output devices* (3 nodes, "to drive output produced") on the right. Nodes are connected by arrows of varying thickness representing connection/signal strength, flowing left to right from input through hidden nodes to outputs.

Neural networks were designed to mimic the processing inside the human brain. They consist of a series of interconnected nodes (artificial neurones). Each neurone can accept a binary input signal and potentially output another signal to connected nodes.

#### Training cycle

Internal weightings and threshold values for each node are determined in the initial training cycle for each neural network. The system is exposed to a series of inputs with known responses. Linear regression with backward chaining is used to iteratively determine the set of unique values required for output. Regular exposure to the training cycle results in improved accuracy and pattern matching.

#### Execution cycle

In the diagram, signal strength between nodes with the strongest weightings are thicker representing a higher priority in determining the final output. The execution cycle follows the training cycle and utilises the internal values developed during the training cycle to determine the output.

---

## Methods for Testing a System

Students are expected to know and understand the following methods for testing a software solution.

- functional testing
- acceptance testing
- live data
- simulated data
- beta testing
- volume testing.

---

## Character Representation

Characters can be represented with ASCII or Unicode. When a developer is working with text strings, they can make use of how the text data is stored internally in its binary format to perform functions such as changing the case of letters in the string, or performing a simple encryption.

---

## Programming with Python

Students are expected to be able to code using the Python programming language.

Students should be familiar with the use of the following features:

- control structures
- global and local variables
- use of simple and structured data types
- classes, objects, attributes and methods
- functions
- modules and libraries
- file handling

Students are expected to design and implement programs incorporating combinations of these features.
