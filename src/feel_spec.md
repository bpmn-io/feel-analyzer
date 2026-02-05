# Expression Language (FEEL)

## Introduction

In **DMN**, all decision logic is represented as *boxed expressions*.
Clause 7.2 introduced the concept of the boxed expression and defined
two simple kinds: boxed literal expressions and boxed invocations.
Clause 8 defined decision tables, a very important kind of boxed
expression*.* This section completes the graphical notation for decision
logic, by defining other kinds of boxed expressions.

The expressions \'in the boxes\' are FEEL expressions. FEEL stands for
Friendly Enough Expression Language and it has the following features:

-   Side-effect free

-   Simple data model with numbers, dates, strings, lists, and contexts

-   Simple syntax designed for a wide audience

-   Three-valued logic (**true, false, null**)

This section also completely specifies the syntax and semantics of FEEL.
The syntax is specified as a grammar (10.3.1). The subset of the syntax
intended to be rendered graphically as a boxed expression is also
specified as a meta-model (10.5).

FEEL has two roles in **DMN**:

1.  As a textual notation in the boxes of boxed expressions such as
    decision tables.

2.  As a slightly larger language to represent the logic of expressions
    and DRGs for the main purpose of composing the semantics in a simple
    and uniform way.

## Notation

### Boxed Expressions

This section builds on the generic notation for decision logic and boxed
expressions defined in clause 7.2.

We define a graphical notation for decision logic called **boxed
expressions**. This notation serves to decompose the decision logic
model into small pieces that can be associated with DRG artifacts. The
DRG plus the boxed expressions form a complete, mostly graphical
language that completely specifies Decision Models.

A boxed expression is either:

-   a decision table

-   a boxed FEEL expression

-   a boxed invocation

-   a boxed context

-   a boxed list

-   a relation

-   a boxed function

-   a boxed conditional

-   a boxed filter, or

-   a boxed iterator

Boxed expressions are defined recursively, *i.e.,* boxed expressions can
contain other boxed expressions. The toplevel boxed expression
corresponds to the decision logic of a single DRG artifact. This boxed
expression SHALL have a name box that contains the name of the DRG
artifact. The name box may be attached in a single box on top, as shown
in Figure 10-1:

![Table Description automatically
generated](media/image91.jpg){width="2.0994663167104113in"
height="0.6777865266841645in"}

**Figure 10-1: Boxed expression**

Alternatively, the name box and expression box can be separated by white
space and connected on the left side with a line, as shown in Figure 10-
2:

![A picture containing table Description automatically
generated](media/image92.jpg){width="2.1310411198600177in"
height="1.1180555555555556in"}

**Figure 10- 2: Boxed expression with separated name and expression
boxes**

Graphical tools are expected to support appropriate graphical links, for
example, clicking on a decision shape opens a decision table.

#### Decision Tables

The executable decision tables defined here use the same notation as the
decision tables defined in Clause 8. Their execution semantics is
defined in clause 10.3.2.10.

#### Boxed FEEL expression

A **boxed FEEL expression** is any FEEL expression *e,* as defined by
the FEEL grammar (clause 10.3.1), in a table cell, as shown in Figure
10-3:

![A picture containing diagram Description automatically
generated](media/image93.jpg){width="0.5557600612423447in"
height="0.5138943569553805in"}

**Figure 10-3: Boxed FEEL expression**

The meaning of a boxed expression containing *e* is **FEEL(***e,*
**s)**, where **s** is the scope. The scope includes the context derived
from the containing DRD as described in 10.4, and any boxed contexts
containing *e*.

It is usually good practice to make *e* relatively simple and compose
small boxed expressions into larger boxed expressions.

#### Boxed Invocation

The syntax for boxed invocation is described in clause 7.2.3. This
syntax may be used to invoke any function (e.g., business knowledge
model, FEEL built-in function, boxed function definition).

The box labeled \'invoked business knowledge model\' can be any boxed
expression whose value is a function, as shown in\
Figure **10-4**:

+-----------------------+----+-----------------------------------------+
| > **Name**            |    |                                         |
+=======================+====+=========================================+
| > function-valued     |    |                                         |
| > expression          |    |                                         |
+-----------------------+----+-----------------------------------------+
| > parameter 1         | >  |                                         |
|                       |  b |                                         |
|                       | in |                                         |
|                       | di |                                         |
|                       | ng |                                         |
|                       | >  |                                         |
|                       | ex |                                         |
|                       | pr |                                         |
|                       | es |                                         |
|                       | si |                                         |
|                       | on |                                         |
|                       | >  |                                         |
|                       |  1 |                                         |
+-----------------------+----+-----------------------------------------+
| > parameter 2         | >  |                                         |
|                       |  b |                                         |
|                       | in |                                         |
|                       | di |                                         |
|                       | ng |                                         |
|                       | >  |                                         |
|                       | ex |                                         |
|                       | pr |                                         |
|                       | es |                                         |
|                       | si |                                         |
|                       | on |                                         |
|                       | >  |                                         |
|                       |  2 |                                         |
+-----------------------+----+-----------------------------------------+
| > ...                 |    |                                         |
+-----------------------+----+-----------------------------------------+
| > parameter *n*       | >  |                                         |
|                       |  b |                                         |
|                       | in |                                         |
|                       | di |                                         |
|                       | ng |                                         |
|                       | >  |                                         |
|                       | ex |                                         |
|                       | pr |                                         |
|                       | es |                                         |
|                       | si |                                         |
|                       | on |                                         |
|                       | >  |                                         |
|                       |  * |                                         |
|                       | n* |                                         |
+-----------------------+----+-----------------------------------------+


**\
Figure 10-4: Boxed invocation**

The boxed syntax maps to the textual syntax defined by grammar rules 38,
39, 40, 41. Boxed invocation uses named parameters. Positional
invocation can be achieved using a boxed expression containing a textual
positional invocation.

The boxed syntax requires at least one parameter. A parameterless
function must be invoked using the textual syntax, e.g., as shown in
Figure 10-5.

> function-valued expression()

**\
****Figure 10-5: Parameterless function**

Formally, the meaning of a boxed invocation is given by the semantics of
the equivalent textual invocation, *e.g.,* **function-valued expression
(**parameter1**: binding expression1,** parameter2**: binding
expression2, \...)**.

#### Boxed Context

A **boxed context** is a collection of *n* (name, value) pairs with an
optional result value. The names SHALL be distinct within a context.
Each pair is called a context entry. Context entries may be separated by
whitespace and connected with a line on the left (top). The intent is
that all the entries of a context should be easily identified by looking
down the left edge of a vertical context or across the top edge of a
horizontal context. Cells SHALL be arranged in one of the following ways
(see Figure 10-6, Figure 10-7):

+---------------------------------+------------------------------------+
| > Name 1                        | > Value 1                          |
+=================================+====================================+
|                                 |                                    |
+---------------------------------+------------------------------------+
| > Name 2                        | > Value 2                          |
+---------------------------------+------------------------------------+
| > Name *n*                      | > Value *n*                        |
+---------------------------------+------------------------------------+
| > Result                        |                                    |
+---------------------------------+------------------------------------+


**Figure 10-6: Vertical context**

+---------------+---------------+---------------+-------+-------------+
| > Name 1      | > Name 2      | > Name *n*    |       | > Result    |
+===============+===============+===============+=======+=============+
|               |               |               |       |             |
+---------------+---------------+---------------+-------+-------------+
| > Value 1     | > Value 2     | > Value *n*   |       |             |
+---------------+---------------+---------------+-------+-------------+


**Figure 10-7: Horizontal context**

The context entries in a context are often used to decompose a complex
expression into simpler expressions, each with a name. These context
entries may be thought of as intermediate results. For example, contexts
without a final Result box are useful for representing case data (see
Figure 10-8).

+-----------------------------+-----------+--------+------------------+
| > **Applicant Data**        |           |        |                  |
+=============================+===========+========+==================+
| > Age                       | > 51      |        |                  |
+-----------------------------+-----------+--------+------------------+
| > MaritalStatus             | > \"M\"   |        |                  |
+-----------------------------+-----------+--------+------------------+
| > EmploymentStatus          | > \"E     |        |                  |
|                             | MPLOYED\" |        |                  |
+-----------------------------+-----------+--------+------------------+
| > ExistingCustomer          | > false   |        |                  |
+-----------------------------+-----------+--------+------------------+
| > Monthly                   | > Income  |        | > 10000.00       |
+-----------------------------+-----------+--------+------------------+
|                             | > R       |        | > 2500.00        |
|                             | epayments |        |                  |
+-----------------------------+-----------+--------+------------------+
|                             | >         |        | > 3000.00        |
|                             |  Expenses |        |                  |
+-----------------------------+-----------+--------+------------------+


**Figure 10-8: Use of context entries**

Contexts with a final result box are useful for representing
calculations (see Figure 10-9).

+----------------------------+----+------------------------------------+
| > **Eligibility**          |    |                                    |
+============================+====+====================================+
| > Age                      | >  |                                    |
|                            | Ap |                                    |
|                            | pl |                                    |
|                            | ic |                                    |
|                            | an |                                    |
|                            | t. |                                    |
|                            | >  |                                    |
|                            |  A |                                    |
|                            | ge |                                    |
+----------------------------+----+------------------------------------+
| > Monthly Income           | >  |                                    |
|                            | Ap |                                    |
|                            | pl |                                    |
|                            | ic |                                    |
|                            | an |                                    |
|                            | t. |                                    |
|                            | >  |                                    |
|                            | Mo |                                    |
|                            | nt |                                    |
|                            | hl |                                    |
|                            | y. |                                    |
|                            | >  |                                    |
|                            | In |                                    |
|                            | co |                                    |
|                            | me |                                    |
+----------------------------+----+------------------------------------+
| > Pre-Bureau Risk Category | >  |                                    |
|                            | Af |                                    |
|                            | fo |                                    |
|                            | rd |                                    |
|                            | ab |                                    |
|                            | il |                                    |
|                            | it |                                    |
|                            | y. |                                    |
|                            | >  |                                    |
|                            | Pr |                                    |
|                            | e- |                                    |
|                            | Bu |                                    |
|                            | re |                                    |
|                            | au |                                    |
|                            | >  |                                    |
|                            | Ri |                                    |
|                            | sk |                                    |
|                            | >  |                                    |
|                            | Ca |                                    |
|                            | te |                                    |
|                            | go |                                    |
|                            | ry |                                    |
+----------------------------+----+------------------------------------+
| > Installment Affordable   | >  |                                    |
|                            | Af |                                    |
|                            | fo |                                    |
|                            | rd |                                    |
|                            | ab |                                    |
|                            | il |                                    |
|                            | it |                                    |
|                            | y. |                                    |
|                            | >  |                                    |
|                            |  I |                                    |
|                            | ns |                                    |
|                            | ta |                                    |
|                            | ll |                                    |
|                            | me |                                    |
|                            | nt |                                    |
|                            | >  |                                    |
|                            | Af |                                    |
|                            | fo |                                    |
|                            | rd |                                    |
|                            | ab |                                    |
|                            | le |                                    |
+----------------------------+----+------------------------------------+
| > if Pre-Bureau Risk       |    |                                    |
| > Category = \"DECLINE\"   |    |                                    |
| > or                       |    |                                    |
| >                          |    |                                    |
| > Installment Affordable = |    |                                    |
| > false or                 |    |                                    |
| >                          |    |                                    |
| > Age \< 18 or             |    |                                    |
| >                          |    |                                    |
| > Monthly Income \< 100    |    |                                    |
| > then \"INELIGIBLE\" else |    |                                    |
| > \"ELIGIBLE\"             |    |                                    |
+----------------------------+----+------------------------------------+


**Figure 10-9: Use of final result box**

When decision tables are (non-result) context entries, the output cell
can be used to name the entry, thus saving space. Any format decision
table can be used in a vertical context. A jagged right edge is allowed.
Whitespace between context entries may be helpful. See Figure 10-10.

**Figure 10-10: Vertical context with decision table entry**

Color is suggested. The names SHALL be legal FEEL names. The values and
optional result are boxed expressions.

Boxed contexts may have a decision table as the result and use the named
context entries to compute the inputs and give them names. For example
(see Figure 10-11):

> **Post-Bureau Risk Category**

+-------+------------+---+---------+-------------+-------------------+
| > Exi |            |   | > App   |             |                   |
| sting |            |   | licant. |             |                   |
| > Cus |            |   | > Ex    |             |                   |
| tomer |            |   | istingC |             |                   |
|       |            |   | ustomer |             |                   |
+-------+------------+---+---------+-------------+-------------------+
| > C   |            |   | >       |             |                   |
| redit |            |   | Report. |             |                   |
| >     |            |   | > Cred  |             |                   |
| Score |            |   | itScore |             |                   |
+-------+------------+---+---------+-------------+-------------------+
| > A   |            |   | >       |             |                   |
| pplic |            |   |  Afford |             |                   |
| ation |            |   | ability |             |                   |
| >     |            |   | > Mo    |             |                   |
|  Risk |            |   | del(App |             |                   |
| >     |            |   | licant, |             |                   |
| Score |            |   | > Pr    |             |                   |
|       |            |   | oduct). |             |                   |
|       |            |   | >       |             |                   |
|       |            |   | > Appl  |             |                   |
|       |            |   | ication |             |                   |
|       |            |   | > Risk  |             |                   |
|       |            |   | > Score |             |                   |
+-------+------------+---+---------+-------------+-------------------+
|       |            |   |         |             |                   |
+-------+------------+---+---------+-------------+-------------------+
| > U   | > Existing | > |         | > Credit    | > Post-Bureau     |
|       | > Customer |   |         | > Score     | > Risk Category   |
|       |            | A |         |             |                   |
|       |            | p |         |             |                   |
|       |            | p |         |             |                   |
|       |            | l |         |             |                   |
|       |            | i |         |             |                   |
|       |            | c |         |             |                   |
|       |            | a |         |             |                   |
|       |            | t |         |             |                   |
|       |            | i |         |             |                   |
|       |            | o |         |             |                   |
|       |            | n |         |             |                   |
|       |            | > |         |             |                   |
|       |            |   |         |             |                   |
|       |            | R |         |             |                   |
|       |            | i |         |             |                   |
|       |            | s |         |             |                   |
|       |            | k |         |             |                   |
|       |            | > |         |             |                   |
|       |            |   |         |             |                   |
|       |            | S |         |             |                   |
|       |            | c |         |             |                   |
|       |            | o |         |             |                   |
|       |            | r |         |             |                   |
|       |            | e |         |             |                   |
+-------+------------+---+---------+-------------+-------------------+
| > 1   | > true     | > |         | > \<590     | > "HIGH"          |
|       |            |   |         |             |                   |
|       |            | \ |         |             |                   |
|       |            | < |         |             |                   |
|       |            | = |         |             |                   |
|       |            | 1 |         |             |                   |
|       |            | 2 |         |             |                   |
|       |            | 0 |         |             |                   |
+-------+------------+---+---------+-------------+-------------------+
|       |            |   |         |             |                   |
+-------+------------+---+---------+-------------+-------------------+
| > 2   |            |   |         | > \         | > "MEDIUM"        |
|       |            |   |         | [590..610\] |                   |
+-------+------------+---+---------+-------------+-------------------+
| > 3   |            |   |         | > \>610     | > "LOW"           |
+-------+------------+---+---------+-------------+-------------------+
| > 4   |            | > |         | > \<600     | > "HIGH"          |
|       |            |   |         |             |                   |
|       |            | \ |         |             |                   |
|       |            | > |         |             |                   |
|       |            | 1 |         |             |                   |
|       |            | 2 |         |             |                   |
|       |            | 0 |         |             |                   |
+-------+------------+---+---------+-------------+-------------------+
| > 5   |            |   |         | > \         | > "MEDIUM"        |
|       |            |   |         | [600..625\] |                   |
+-------+------------+---+---------+-------------+-------------------+
| > 6   |            |   |         | > \>625     | > "LOW"           |
+-------+------------+---+---------+-------------+-------------------+
| > 7   | > false    | > |         | > \<580     | > "HIGH"          |
|       |            |   |         |             |                   |
|       |            | \ |         |             |                   |
|       |            | < |         |             |                   |
|       |            | = |         |             |                   |
|       |            | 1 |         |             |                   |
|       |            | 0 |         |             |                   |
|       |            | 0 |         |             |                   |
+-------+------------+---+---------+-------------+-------------------+
|       |            |   |         |             |                   |
+-------+------------+---+---------+-------------+-------------------+
| > 8   |            |   |         | > \         | > "MEDIUM"        |
|       |            |   |         | [580..600\] |                   |
+-------+------------+---+---------+-------------+-------------------+
| > 9   |            |   |         | > \>600     | > "LOW"           |
+-------+------------+---+---------+-------------+-------------------+
| > 10  |            | > |         | > \<590     | > "HIGH"          |
|       |            |   |         |             |                   |
|       |            | \ |         |             |                   |
|       |            | > |         |             |                   |
|       |            | 1 |         |             |                   |
|       |            | 0 |         |             |                   |
|       |            | 0 |         |             |                   |
+-------+------------+---+---------+-------------+-------------------+
|       |            |   |         |             |                   |
+-------+------------+---+---------+-------------+-------------------+
| > 11  |            |   |         | > \         | > "MEDIUM"        |
|       |            |   |         | [590..615\] |                   |
+-------+------------+---+---------+-------------+-------------------+
| > 12  |            |   |         | > \>615     | > "LOW"           |
+-------+------------+---+---------+-------------+-------------------+


**Figure 10-11: Use of boxed expressions with a decision table**

Formally, the meaning of a boxed context is { "Name 1": Value 1, "Name
2": Value 2, \..., "Name *n"*: Value *n* } if no Result is specified.
Otherwise, the meaning is { "Name 1": Value 1, "Name 2": Value 2, \...,
"Name *n"*: Value *n*, "result": Result }.result. Recall that the bold
face indicates elements in the FEEL Semantic Domain. The scope includes
the context derived from the containing DRG as described in 10.4.

Boxed context entries for contexts that do not have a result box are
accessible outside the context (as QNs), subject to the scope rules
defined in clause 10.3.2.11. Boxed context entries for contexts that
have a result box are not accessible outside the context.

#### Boxed List

A **boxed list** is a list of *n* items. Cells SHALL be arranged in one
of the following ways (see Figure 10-12, Figure 10-13):

![Table Description automatically
generated](media/image94.jpg){width="1.5139107611548557in"
height="1.2847003499562555in"}

**Figure 10-12: Vertical list**

> Item 1**,** Item 2**,** Item *n*

**Figure 10-13: Horizontal list**

Line styles are normative. The items are boxed expressions. Formally,
the meaning of a boxed list is just the meaning of the list, i.e., **\[
Item 1, Item 2, \..., Item *n* \]**. The scope includes the context
derived from the containing DRG as described in 10.4.

#### Relation

A vertical list of homogeneous horizontal contexts (with no result
cells) can be displayed with the names appearing just once at the top of
the list, like a relational table, as shown in Figure 10-14:

+---------------------+---------------------+--------------------------+
| > Name 1            | > Name 2            | Name *n*                 |
+=====================+=====================+==========================+
| > Value 1a          | > Value 2a          | > Value *n*a             |
+---------------------+---------------------+--------------------------+
| > Value 1b          | > Value 2b          | > Value *n*b             |
+---------------------+---------------------+--------------------------+
| Value 1*m*          | > Value 2*m*        | Value *nm*               |
+---------------------+---------------------+--------------------------+


**Figure 10-14: Relation**

#### Boxed Function

A Boxed Function Definition is the notation for parameterized boxed
expressions.

The boxed expression associated with a Business Knowledge Model SHALL be
a boxed function definition or a decision table whose input expressions
are assumed to be the parameter names.

A boxed function has 3 cells:

1.  **Kind**, containing the initial letter of one of the following:

    -   **F**EEL

    -   **P**MML

    -   **J**ava

The **Kind** box can be omitted for FEEL functions, including decision
tables.

2.  Parameters: 0 or more comma-separated names, in parentheses

3.  Body: a boxed expression

The 3 cells SHALL be arranged as shown in Figure 10-15:

+---------+------------------------------------------------------------+
| K       | (Parameter1, Parameter2, ...)                              |
+=========+============================================================+
|         | > Body                                                     |
+---------+------------------------------------------------------------+


**Figure 10-15: Boxed function definition**

For FEEL functions, denoted by **Kind** FEEL or by omission of **Kind**,
the Body SHALL be a FEEL expression that references the parameters. For
externally defined functions denoted by Kind Java, the Body SHALL be a
context as described in 10.3.2.13.3 and the form of the mapping
information SHALL be the *java* form. For externally defined functions
denoted by **Kind** PMML, the Body SHALL be a context as described in
10.3.2.13.3 and the form of the mapping information SHALL be the *pmml*
form.

Formally, the meaning of a boxed function is just the meaning of the
function, *i.e.*, FEEL(*funcion(Parameter1, Parameter2, \...) Body*) if
the **Kind** is FEEL, and FEEL(*funcion(Parameter1, Parameter2, \...)
external Body*) otherwise. The scope includes the context derived from
the containing DRG as described in 10.4.

#### Boxed conditional

Boxed conditional offers a visual representation of an **if** statement
using three rows. The first one is labelled "if"; the second one is
labelled "then" and the last one is labelled "else". In the right part,
another FEEL expression is expected. The expression in the "if" part
MUST resolve to a boolean.

![Table Description automatically
generated](media/image95.jpg){width="3.3109722222222224in"
height="1.5722222222222222in"}

**Figure 10-16: Boxed conditional**

Color is suggested.

![Table Description automatically
generated](media/image96.jpg){width="5.249027777777778in"
height="4.040972222222222in"}

**Figure 10-17: Use of conditional expression with decision table and
invocation**

#### Boxed filter

Boxed filter offers a visual representation of collection filtering. The
top part is an expression that is the collection to be filtered. The
bottom part, between the square brackets, holds the filter expression.
The expression in the top part MUST resolve to a collection. The
expression in the bottom part MUST resolve to a Boolean.

![Table Description automatically
generated](media/image97.jpg){width="3.549722222222222in"
height="1.051388888888889in"}

**Figure 10-18: Filter expression**

Color is suggested but it is considered a good practice to have a
different color for the square brackets, so the filtering expression is
easier to see.

![Table Description automatically
generated](media/image98.jpg){width="2.582638888888889in"
height="3.0720833333333335in"}

**Figure 10-19: Use of filter expression with a list expression**

#### Boxed iterator

Boxed iterator offers a visual representation of an iterator statement.
There are three flavors to it: **for** loop and quantified expression
**some** and **every**.

For the **for** loop, the three rows are labelled "for", "in" and
"return". The right part of the "for" displays the iterator variable
name. The second row holds an expression representing the collection
that will be iterated over. The expression in the in row MUST resolve to
a collection. The last row contains the expression that will process
each element of the collection.

![Table Description automatically
generated](media/image99.jpg){width="3.3109722222222224in"
height="1.551388888888889in"}

**Figure 10-20: For expression**

![Table Description automatically
generated](media/image100.jpg){width="6.518611111111111in"
height="2.020138888888889in"}

**Figure 10-21: Use of for expression that returns a context**

**Every** and **some** expression have a similar structure. The only
difference between the two is the caption on the first line which is
"every" or "some". The second line is labelled "in" and the last one
"satisfies". The right part of the first line is the iterator variable
name. The expression defined in the second row is the collection that
will be tested. The expression in the in row MUST resolve to a
collection. The last line is an expression that will be evaluated on
each item. The expression defined in the satisfies MUST resolve to a
boolean.

![Table Description automatically
generated](media/image101.jpg){width="3.3109722222222224in"
height="1.551388888888889in"}

**Figure 10-22: Every expression**

![Table Description automatically
generated](media/image102.jpg){width="3.1532141294838145in"
height="3.4657567804024496in"}

**Figure 10-23: Use of every with a list expression**

![Table Description automatically
generated](media/image103.jpg){width="3.3109722222222224in"
height="1.551388888888889in"}

**Figure 10-24: Some expression**

> ![A picture containing table Description automatically
> generated](media/image104.jpg){width="4.332361111111111in"
> height="6.113194444444445in"}

**Figure 10-25: Use of some with a relation and a decision table**

### FEEL

A subset of FEEL, defined in the next section, serves as the notation
\"in the boxes\" of boxed expressions. A FEEL object is a number, a
string, a date, a time, a duration, a function, a context, or a list of
FEEL objects (including nested lists).

Note: A JSON object is a number, a string, a context (JSON calls them
maps) or a list of JSON objects. So, FEEL is an extension of JSON in
this regard. In addition, FEEL provides friendlier syntax for literal
values, and does not require context keys to be quoted.

Here we give a \"feel\" for the language by starting with some simple
examples.

#### Comparison of ranges

Ranges and lists of ranges appear in decision table input entry, input
value, and output value cells. In the examples in Table 39, this portion
of the syntax is shown underlined. Strings, dates, times, and durations
also may be compared, using typographical literals defined in section
7.2.2.1.

+--------------------------------+-------------------------------------+
| > **FEEL Expression**          | **Value**                           |
+================================+=====================================+
| > 5 in ([\<=5]{.underline} )   | true                                |
+--------------------------------+-------------------------------------+
| > 5 in (                       | false                               |
| > ([5..10]{.underline}\] )     |                                     |
+--------------------------------+-------------------------------------+
| > 5 in (                       | true                                |
| > \[[5..10]{.underline}\] )    |                                     |
+--------------------------------+-------------------------------------+
| > 5 in ([4, 5, 6]{.underline}) | true                                |
+--------------------------------+-------------------------------------+
| > 5 in (\<5, \>5)              | false                               |
+--------------------------------+-------------------------------------+
| > ***2012-12-31*** in (        | true                                |
| >                              |                                     |
|  (***[2012-12-]{.underline}*** |                                     |
| >                              |                                     |
| > ***[2                        |                                     |
| 5..2013-02-14]{.underline}***) |                                     |
| > )                            |                                     |
+--------------------------------+-------------------------------------+


#### Numbers

FEEL numbers and calculations are exemplified in Table 40.

**Table 40: FEEL numbers and calculations**

+---------------------------+------------------------------------------+
| **FEEL Expression**       | > **Value**                              |
+===========================+==========================================+
| > decimal(1, 2)           | 1.00                                     |
+---------------------------+------------------------------------------+
| > .25 + .2                | 0.45                                     |
+---------------------------+------------------------------------------+
| > .10 \* 30.00            | 3.0000                                   |
+---------------------------+------------------------------------------+
| > 1 + 3/2\*2 - 2\*\*3     | -4.0                                     |
+---------------------------+------------------------------------------+
| > 1/3                     | 0.3333333333333333333333333333333333     |
+---------------------------+------------------------------------------+
| > decimal(1/3, 2)         | 0.33                                     |
+---------------------------+------------------------------------------+
| > 1 = 1.000               | true                                     |
+---------------------------+------------------------------------------+
| > 1.01/2                  | 0.505                                    |
+---------------------------+------------------------------------------+
| > decimal(0.505, 2)       | 0.50                                     |
+---------------------------+------------------------------------------+
| > decimal(0.515, 2)       | 0.52                                     |
+---------------------------+------------------------------------------+
| > 1.0\*10\*\*3            | 1000.0                                   |
+---------------------------+------------------------------------------+


## Full FEEL Syntax and Semantics

Clause 9 introduced a subset of FEEL sufficient to support decision
tables for Conformance Level 2 (see clause 2). The full **DMN**
friendly-enough expression language (FEEL) required for Conformance
Level 3 is specified here.

FEEL is a simple language with inspiration drawn from Java, JavaScript,
XPath, SQL, PMML, Lisp, and many others.

The syntax is defined using grammar rules that show how complex
expressions are composed of simpler expressions. Likewise, the semantic
rules show how the meaning of a complex expression is composed from the
meaning of constituent simper expressions.

**DMN** completely defines the meaning of FEEL expressions that do not
invoke externally-defined functions. There are no implementation-defined
semantics. FEEL expressions (that do not invoke externally-defined
functions) have no side- effects and have the same interpretation in
every conformant implementation. Externally-defined functions SHOULD be
deterministic and side-effect free.

### Syntax

FEEL syntax is defined as grammar here and equivalently as a UML Class
diagram in the meta-model (10.5)

#### Grammar notation

The grammar rules use the ISO EBNF notation. Each rule defines a
non-terminal symbol *S* in terms of some other symbols *S1, S2, \...*
The following table summarizes the EBNF notation.

  -----------------------------------------------------------------------
  **Example**                         **Meaning**
  ----------------------------------- -----------------------------------
  *S = S1 ;*                          Symbol *S* is defined in terms of
                                      symbol *S1*

  *S1 \| S2*                          Either *S1* or *S2*

  *S1, S2*                            *S1* followed by *S2*

  *\[S1\]*                            *S1* occurring 0 or 1 time

  *{S1}*                              *S1* repeated 0 or more times

  *k \* S1*                           *S1* repeated k times

  \"and\"                             literal terminal symbol
  -----------------------------------------------------------------------

  : **Table 60: Semantics of exponentiation**

We extend the ISO notation with character ranges for brevity, as
follows:

A character range has the following EBNF syntax:

character range = \"\[\", low character, \"-\", high character, \"\]\" ;
low character = unicode character ; high character = unicode character ;
unicode character = simple character \| code point ; code point =
\"\\u\", 4 \* hexadecimal digit \| \"\\U\", 6 \* hexadecimal digit;
hexadecimal digit = \"0\" \| \"1\" \| \"2\" \| \"3\" \| \"4\" \| \"5\"
\| \"6\" \| \"7\" \| \"8\" \| \"9\" \|

\"a\" \| \"A\" \| \"b\" \| \"B\" \| \"c\" \| \"C\" \| \"d\" \| \"D\" \|
\"e\" \| \"E\" \| \"f\" \| \"F\" ;

A simple character is a single Unicode character, *e.g.,* a, 1, \$,
*etc.* Alternatively, a character may be specified by its hexadecimal
code point value, prefixed with *\\u*.

Every Unicode character has a numeric code point value. The low
character in a range must have numeric value less than the numeric value
of the high character.

For example, hexadecimal digit can be described more succinctly using
character ranges as follows:

> hexadecimal digit = \[0-9\] \| \[a-i \| \[A-F\] ;

Note that the character range that includes all Unicode characters is
*\[\\u0-\\u10FFFF\]*.

#### Grammar rules

The complete FEEL grammar is specified below. Grammar rules are
numbered, and in some cases, alternatives are lettered, for later
reference. Boxed expression syntax (rule 53) is used to give execution
semantics to boxed expressions.

1.  expression =

    a.  boxed expression \|

    b.  textual expression ;

2.  textual expression =

    a.  for expression \| if expression \| quantified expression \|

    b.  disjunction \|

    c.  conjunction \|

    d.  comparison \|

    e.  arithmetic expression \|

    f.  instance of \|

    g.  path expression \| filter expression \| function invocation \|

    h.  literal \| simple positive unary test \| name \| \"(\" ,
        expression , \")\" ;

3.  textual expressions = textual expression , { \",\" , textual
    expression } ;

4.  arithmetic expression =

    a.  addition \| subtraction \|

    b.  multiplication \| division \|

    c.  exponentiation \|

    d.  arithmetic negation ;

5.  simple expression = arithmetic expression \| simple value ;

6.  simple expressions = simple expression , { \",\" , simple expression
    } ;

7.  simple positive unary test =

    a.  ( \"\<\" \| \"\<=\" \| \"\>\" \| \"\>=\" \| \"=\" \| \"!=\" ) ,
        endpoint \|

    b.  interval ;

8.  interval = ( open interval start \| closed interval start ) ,
    endpoint , \"..\" , endpoint , ( open interval end \| closed
    interval end ) ;

9.  open interval start = \"(\" \| \"\]\" ;

10. closed interval start = \"\[\" ;

11. open interval end = \")\" \| \"\[\" ;

12. closed interval end = \"\]\" ;

13. positive unary test = expression ;

14. positive unary tests = positive unary test , { \",\" , positive
    unary test } ;

15. unary tests =

    a.  positive unary tests \|

    b.  \"not\", \" (\", positive unary tests, \")\" \|

    c.  \"-\"

16. endpoint = expression ;

17. simple value = qualified name \| simple literal ;

18. qualified name = name , { \".\" , name } ;

19. addition = expression , \"+\" , expression ;

20. subtraction = expression , \"-\" , expression ;

21. multiplication = expression , \"\*\" , expression ;

22. division = expression , \"/\" , expression ;

23. exponentiation = expression, \"\*\*\", expression ;

24. arithmetic negation = \"-\" , expression ;

25. name = name start , { name part \| additional name symbols } ;

26. name start = name start char, { name part char } ;

27. name part = name part char , { name part char } ;

28. name start char = \"?\" \| \[A-Z\] \| \"\_\" \| \[a-z\] \|
    \[\\uC0-\\uD6\] \| \[\\uD8-\\uF6\] \| \[\\uF8-\\u2FF\] \|
    \[\\u370-\\u37D\] \| \[\\u37F-\\u1FFF\] \|

> \[\\u200C-\\u200D\] \| \[\\u2070-\\u21 8F\] \| \[\\u2C00-\\u2FEF\] \|
> \[\\u3001 -\\uD7FF\] \| \[\\uF900-\\uFDCF\] \| \[\\uFDF0-\\uFFFD\] \|
> \[\\u10000-\\uEFFFF\] ;

29. name part char = name start char \| digit \| \\uB7 \|
    \[\\u0300-\\u036F\] \| \[\\u203F-\\u2040\] ;

30. additional name symbols = \".\" \| \"/\" \| \"-\" \| \"'\" \| \"+\"
    \| \"\*\" ;

31. literal = simple literal \| \"null\" ;

32. simple literal = numeric literal \| string literal \| boolean
    literal \| date time literal ;

33. string literal = \"\"\", { character -- (\"\"\" \| vertical space)
    \| string escape sequence}, \"\"\" ;

34. boolean literal = \"true\" \| \"false\" ;

35. numeric literal = \[ \"-\" \] , ( digits , \[ \".\", digits \] \|
    \".\" , digits, \[ ( \"e\" \| \"E\" ) , \[ \"+\" \| \"-\" \] ,
    digits \] ) ;

36. digit = \[0-9\] ;

37. digits = digit , {digit} ;

38. function invocation = expression , parameters ;

39. parameters = \"(\" , ( named parameters \| positional parameters ) ,
    \")\" ;

40. named parameters = parameter name , \":\" , expression , { \",\" ,
    parameter name , \":\" , expression } ;

41. parameter name = name ;

42. positional parameters = \[ expression , { \",\" , expression } \] ;

43. path expression = expression , \".\" , name ;

44. for expression = \"for\" , name , \"in\" , iteration context { \",\"
    , name , \"in\" , iteration context } , \"return\" , expression

;

45. if expression = \"if\" , expression , \"then\" , expression ,
    \"else\" expression ;

46. quantified expression = (\"some\" \| \"every\") , name , \"in\" ,
    expression , { \",\" , name , \"in\" , expression } , \"satisfies\"

,

> expression ;

47. disjunction = expression , \"or\" , expression ;

48. conjunction = expression , \"and\" , expression ;

49. comparison =

    a.  expression , ( \"=\" \| \"!=\" \| \"\<\" \| \"\<=\" \| \"\>\" \|
        \"\>=\" ) , expression \|

    b.  expression , \"between\" , expression , \"and\" , expression \|

    c.  expression , \"in\" , positive unary test \|

    d.  expression , \"in\" , \" (\", positive unary tests, \")\" ;

50. filter expression = expression , \"\[\" , expression , \"\]\" ;

51. instance of = expression , \"instance\" , \"of\" , type ;

52. type =

> qualified name \|
>
> \"range\" \"\<\" type \"\>\" \|
>
> \"list\" \"\<\" type \"\>\" \|
>
> \"context\" \"\<\" name \":\" type { \",\" name \":\" type } \"\>\" \|
> \"function\" \"\<\" \[ type { \", \" type } \] \"\>\" \"-\>\" type
>
> ;

53. boxed expression = list \| function definition \| context ;

54. list = \"\[\" , \[ expression , { \",\" , expression } \] , \"\]\" ;

55. function definition = \"function\" , \"(\" , \[ formal parameter {
    \",\" , formal parameter } \] , \")\" , \[ \"external\" \] ,
    expression ;

56. formal parameter = parameter name \[\":\" type \] ;

57. context = \"{\" , \[context entry , { \",\" , context entry } \] ,
    \"}\" ;

58. context entry = key , \":\" , expression ;

59. key = name \| string literal ;

60. date time literal = at literal \| function invocation;

61. white space = vertical space \| \\u0009 \| \\u0020 \| \\u0085 \|
    \\u00A0 \| \\u1 680 \| \\u1 80E \| \[\\u2000-\\u200B\] \| \\u2028 \|

> \\u2029 \| \\u202F \| \\u205F \| \\u3000 \| \\uFEFF ;

62. vertical space = \[\\u000A-\\u000D\]

63. iteration context = expression, \[ "..", expression \];

64. string escape sequence = \"\\\'\" \| \"\\\"\" \| \"\\\\\" \| \"\\n\"
    \| \"\\r\" \| \"\\t\" \| code point;

65. at literal = "@", string literal

> 66\. range literal =
>
> a\. ( open range start \| closed range start ) , range endpoint ,
> \"..\" , range endpoint ( open range end \| closed range end ) \|
>
> b\. open range start , \"..\" , range endpoint ( open range end \|
> closed range end ) \|
>
> c\. ( open range start \| closed range start ) , range endpoint ,
> \"..\" , open range end ;
>
> 67\. range endpoint = numeric literal \| string literal \| date time
> literal ;

Additional syntax rules:

-   Operator precedence is given by the order of the alternatives in
    grammar rules 1, 2 and 4, in order from lowest to highest. *E.g.,*
    (boxed) invocation has higher precedence than multiplication,
    multiplication has higher precedence than addition, and addition has
    higher precedence than comparison. Addition and subtraction have
    equal precedence, and like all FEEL infix binary operators, are left
    associative. Note that FEEL's order of operations regarding
    arithmetic negation and exponentiation differs from standard
    mathematical precedence, e.g. the FEEL expression -4 \*\* 2 is
    interpreted as (-4)\*(-4) and evaluates to 16. In standard
    mathematics, -4 \*\* 2 is interpreted as -(4\*4) and evaluates to
    -16 instead. To avoid any ambiguity, users are recommend to use
    explicit parentheses, e.g. instead of -4 \*\* 2 specify -(4 \*\* 2)
    = -16 or (-4) \*\* 2 = 16 as appropriate. Tools MAY present a
    warning to users to inform about the potentially unexpected
    precedence of the combination of these two operators.

-   Java-style comments can be used, *i.e.* \'//\' to end of line and
    /\* \... \*/.

-   In rule 60 (\"date time literal\"), for the \"function invocation\"
    alternative, the only permitted functions are the builtins *date*,
    *time*, *date and time*, and *duration*.

-   The string in rule 65 must follow the date string, time string, date
    and time string or duration string syntax, as detailed in section
    10.3.4.1.

#### Literals, data types, built-in functions

FEEL supports literal syntax for numbers, strings, booleans, date, time,
date and time, duration, and *null*. (See grammar rules, clause
10.3.1.2). Literals can be mapped directly to values in the FEEL
semantic domain (clause 10.3.2.1).

FEEL supports the following datatypes:

-   Number

-   String

-   Boolean

-   days and time duration

-   years and months duration

-   date

-   time

-   date and time

-   list

-   range

-   context

-   function

#### Tokens, Names and White space

A FEEL expression consists of a sequence of tokens, possibly separated
with white space (grammar rule 63). A token is a sequence of Unicode
characters, either:

-   A literal terminal symbol in any grammar rule other than grammar
    rule 30. Literal terminal symbols are enclosed in double quotes in
    the grammar rules, e.g., "and", "+", "=", or

-   A sequence conforming to grammar rule 28, 29, 35, or 37

For backward compatibility reasons, "list", "context" and "range" from
grammar rule 52 are not considered literal terminal symbols.

White space (except inside strings) acts as token separators. Most
grammar rules act on tokens, and thus ignore white space (which is not a
token).

A name (grammar rule 27) is defined as a sequence of tokens. I.e., the
name IncomeTaxesAmount is defined as the list of tokens **\[ Income,
Taxes, Amount \]**. The name Income+Expenses is defined as the list of
tokens **\[ Income, + , Expenses \]**. A consequence of this is that a
name like Phone Number with one space in between the tokens is the same
as Phone Number with several spaces in between the tokens.

A name start (grammar rule 26) SHALL NOT be a literal terminal symbol.

A name part (grammar rule 27) MAY be a literal terminal symbol.

#### Contexts, Lists, Qualified Names, and Context Lists

A context is a map of key-value pairs called context entries and is
written using curly braces to delimit the context, commas to separate
the entries, and a colon to separate key and value (grammar rule 57).
The key can be a string or a name. The value is an expression.

A list is written using square brackets to delimit the list, and commas
to separate the list items (grammar rule 54).

Contexts and lists can reference other contexts and lists, giving rise
to a directed acyclic graph. Naming is path based. The *qualified name*
(QN) of a context entry is of the form *N1*.*N2 \... N~n~* where *N1* is
the name of an in-scope context.

Nested lists encountered in the interpretation of *N1*.*N2 \... N~n~*
are preserved. *E.g.,*

> *\[{a: {b: \[1\]}}, {a: {b: \[2.1, 2.2\]}}, {a: {b: \[3\]}}, {a: {b:
> \[4, 5\]}}\].a.b =*
>
> *\[{b: \[1\]}, {b: \[2.1,2.2\]}, {b: \[3\]}, {b: \[4, 5\]}\].b =*
>
> *\[\[1\], \[2.1, 2.2\], \[3\], \[4, 5\]\]*

Nested lists can be flattened using the *flatten()* built-in function
(10.3.4).

#### Ambiguity

FEEL expressions reference InformationItems by their qualified name
(QN), in which name parts are separated by a period. For example,
variables containing components are referenced as
\[varName\].\[componentName\]. Imported elements such as
InformationItems and ItemDefinitions are referenced by
namespace-qualified name, in which the first name part is the name
specified by the Import element importing the element. For example, an
imported variable containing components is referenced as \[import
name\].\[varName\].\[componentName\].

Because names are a sequence of tokens, and some of those tokens can be
FEEL operators and keywords, context is required to resolve ambiguity.
For example, the following could be names or other expressions:

-   a-b

-   a -- b

-   what if?

-   Profit and loss

Ambiguity is resolved using the scope. Name tokens are matched from left
to right against the names in-scope, and the longest match is preferred.
In the case where the longest match is not desired, parenthesis or other
punctuation (that is not allowed in a name) can be used to disambiguate
a FEEL expression. For example, to subtract b from a if a-b is the name
of an in-scope context entry, one could write (a)-(b). Notice that it
does not help to write a - b, using space to separate the tokens,
because the space is not part of the token sequence and thus not part of
the name.

### Semantics

FEEL semantics is specified by mapping syntax -fragments to values in
the FEEL semantic domain. Literals (clause 10.3.1.3) can be mapped
directly. Expressions composed of literals are mapped to values in the
semantic domain using simple logical and arithmetic operations on the
mapped literal values. In general, the semantics of any FEEL expression
are composed from the semantics of its sub-expressions.

#### Semantic Domain

The FEEL semantic domain **D** consists of an infinite number of typed
values. The types are organized into a lattice called **L**.

The types include:

-   simple datatypes such as number, boolean, string, date, time, and
    duration

-   constructed datatypes such as functions, lists, and contexts

-   the Null type, which includes only the **null** value

-   the special type Any, which includes all values in **D**

A function is a lambda expression with lexical closure or is externally
defined by Java or PMML. A list is an ordered collection of domain
elements, and a context is a partially ordered collection of (string,
value) pairs called context entries.

We use *italics* to denote syntactic elements and **boldface** to denote
semantic elements. For example, FEEL**(***\[1+ 1, 2+2\]***) is \[2,
4\]**

Note that we use bold **\[\]** to denote a list in the FEEL semantic
domain, and bold numbers **2, 4** to denote those decimal values in the
FEEL semantic domain.

#### Equality, Identity and Equivalence

The semantics of equality are specified in the semantic mappings in
clause 10.3.2.15. In general, the values to be compared must be of the
same kind, for example, both numbers, to obtain a non-null result.

Identity simply compares whether two objects in the semantic domain are
the same object. We denote the test for identity using infix **is**, and
its negation using infix **is not**. For example, FEEL( *\"1\" = 1*)
**is null**. Note that **is** never results in **null**.

Every FEEL expression *e* in scope s can be mapped to an element **e**
in the FEEL semantic domain. This mapping defines the meaning of *e* in
s. The mapping may be written **e is** FEEL(*e*,s). Two FEEL expressions
*e~1~* and *e~2~* are equivalent in scope s if and only if
FEEL(*e~1~*,s) **is** FEEL(*e~2~*,s). When s is understood from context
(or not important), we may abbreviate the equivalence as **e~1~ is
e~2~**.

#### Semantics of literals and datatypes

FEEL datatypes are described in the following sub-sections. The meaning
of the datatypes includes:

1.  A mapping from a literal form (which in some cases is a string) to a
    value in the semantic domain.

2.  A precise definition of the set of semantic domain values belonging
    to the datatype, and the operations on them.

Each datatype describes a (possibly infinite) set of values. The sets
for the datatypes defined below are disjoint. We use *italics* to
indicate a literal and **boldface** to indicate a value in the semantic
domain.

##### number

FEEL Numbers are based on IEEE 754-2008 Decimal128 format, with 34
decimal digits of precision and rounding toward the nearest neighbor
with ties favoring the even neighbor. Numbers are a restriction of the
XML Schema type precisionDecimal, and are equivalent to Java BigDecimal
with MathContext DECIMAL 128.

Grammar rule 35 defines literal numbers. Literals consist of base 10
digits, an optional decimal point and an optional exponent. --INF, +INF,
and NaN literals are not supported. There is no distinction between -0
and 0. The number(from, grouping separator, decimal separator) built-in
function supports a richer literal format. E.g., FEEL(number(\"1.
000.000,01 \", \". \", \",\")) = **1000000.01**.

FEEL supports literal scientific notation, e.g., 1.2e3, which is
equivalent to 1.2\*10\*\*3.

A FEEL number is represented in the semantic domain as a pair of
integers **(p,s)** such that **p** is a signed 34 digit integer carrying
the precision information, and **s** is the scale, in the range \[−611
1..6176\]. Each such pair represents the number **p**/10**^s^**. To
indicate the numeric value, we write **value(p,s)**. *E.g.*
**value(100,2) = 1.** If precision is not of concern, we may write the
value as simply **1**. Note that many different pairs have the same
value. For example, **value(1,0) = value(10,1) = value(100,2)**.

There is no value for notANumber, positiveInfinity, or negativeInfinity.
Use **null** instead.

##### string

Grammar rule 33 defines literal strings as a double-quoted sequence of
Unicode characters (see

[[https://unicode.org/glossary/#character),]{.underline}](https://unicode.org/glossary/#character),)
e.g., \"abc\". The supported Unicode character range is
\[\\u0-\\u10FFFF\]. The string literals are described by rule 33. The
corresponding Unicode code points are used to encode a string literal.

The literal string *\"abc\"* is mapped to the semantic domain as a
sequence of three Unicode characters **a**, **b**, and **c**, written
**\"abc\"**. The literal *\"\\ U01F4 0E\"* is mapped to a sequence of
one Unicode character written **\"ὀ\"** corresponding to the code point
U+1F40E. ![](media/image105.png){width="7.0e-2in" height="0.12in"}

##### boolean

The Boolean literals are given by grammar rule 34. The values in the
semantic domain are **true** and **false**.

##### time

Times in FEEL can be expressed using either a time literal (see grammar
rule 65) or the *time()* built-in function (See 10.3.4.1). We use
boldface time literals to represent values in the semantic domain.

A time in the semantic domain is a value of the XML Schema time
datatype. It can be represented by a sequence of numbers for the hour,
minute, second, and an optional time offset from Universal Coordinated
Time (UTC). If a time offset is specified, including time offset =
00:00, the time value has a UTC form and is comparable to all time
values that have UTC forms. If no time offset is specified, the time is
interpreted as a local time of day at some location, whose relationship
to UTC time is dependent on time zone rules for that location and may
vary from day to day. A local time of day value is only sometimes
comparable to UTC time values, as described in XML Schema Part 2
Datatypes.

A time **t** can also be represented as the number of seconds since
midnight. We write this as **valuet(t)**. *E.g.,* **valuet(01:01:01) =
3661**.

The **valuet** function is one-to-one, but its range is restricted to
\[0..86400\]. So, it has an inverse function **valuet ^-1^**(x) that
returns: the corresponding time value for x, if x is in \[0..86400\];
and **valuet ^-1^**(y), where y = x -- floor(x/86400) \* 86400, if x is
not in \[0..86400\].

Note: That is, **valuet ^-1^**(x) is always actually applied to x modulo
86400. For example, **valuet ^-1^**(3600) will return the time of day
that is "01:00:00", **valuet ^-1^**(90000) will also return "T01
:00:00", and **valuet ^-1^**(-3600) will return the time of day that is
"23 :00:00", treating -3600 seconds as one hour *before* midnight.

##### date

Dates in FEEL can be expressed using either a date literal (see grammar
rule 65) or the date() built-in function (See 10.3.4.1). A date in the
semantic domain is a sequence of numbers for the year, month, day of the
month. The year must be in the range \[-999,999,999. .999,999,999\]. We
use boldface date literals to represent values in the semantic domain.

When a date value is subject to implicit conversions (10.3.2.9.4) it is
considered to be equivalent to a date time\
value in which the time of day is UTC midnight (00:00:00).

##### date-time

*Date and time* in FEEL can be expressed using either a *date time
literal* (see grammar rule 65) or the *date and time()* built-in
function (See 10.3.2.3.6). We use boldface *date and time literals* to
represent values in the semantic domain.

A date and time in the semantic domain is a sequence of numbers for the
year, month, day, hour, minute, second, and optional time offset from
Universal Coordinated Time (UTC). The year must be in the range \[-

999,999,999..999,999,999\]. If there is an associated time offset,
including 00:00, the date-time value has a UTC form and is comparable to
all other date-time values that have UTC forms. If there is no
associated time offset, the time is taken to be a local time of day at
some location, according to the time zone rules for that location. When
the time zone is specified, e.g., using the IANA tz form (see 10.3.4.1),
the date-time value may be converted to a UTC form using the time zone
rules for that location, if applicable.

Note: projecting timezone rules into the future may only be safe for
near-term date-time values.

A date and time **d** that has a UTC form can be represented as a number
of seconds since a reference date and time (called the epoch). We write
**valuedt(d)** to represent the number of seconds between **d** and the
epoch. The **valuedt** function is one- to-one and so it has an inverse
function **valuedt ^-1^**. *E.g.,* **valuedt^-1^(valuedt(d)) = d.
valuedt ^-1^** returns **null** rather than a date with a year outside
the legal range.

##### days and time duration

Days and time durations in FEEL can be expressed using either a duration
literal (see grammar rule 65) or the duration() builtin function (See
10.3.4.1). We use boldface days and time duration literals to represent
values in the semantic domain. The literal format of the characters
within the quotes of the string literal is defined by the lexical space
of the XPath Data Model dayTimeDuration datatype. A days and time
duration in the semantic domain is a sequence of numbers for the days,
hours, minutes, and seconds of duration, normalized such that the sum of
these numbers is minimized. For example, FEEL(*duration(\"P0DT25H\")*) =
**P1DT1H**.

The value of a days and time duration can be expressed as a number of
seconds. *E.g.*, **valuedtd(P1DT1H) = 90000.** The **valuedtd** function
is one-to-one and so it has an inverse function **valuedtd ~-1~**.
*E.g.,* **valuedtd ^-1^(90000) = P1DT1H.**

##### years and months duration

Years and months durations in FEEL can be expressed using either a
duration literal (see grammar rule 65) or the duration() built-in
function (See 10.3.4.1). We use boldface years and month duration
literals to represent values in the semantic domain. The literal format
of the characters within the quotes of the string literal is defined by
the lexical space of the XPath Data Model yearMonthDuration datatype. A
years and months duration in the semantic domain is a pair of numbers
for the years and months of duration, normalized such that the sum of
these numbers is minimized. For example, FEEL(*duration(\"P0Y13M\")*) =
**P1Y1M**.

The value of a years and months duration can be expressed as a number of
months. *E.g.*, **value~ymd~(P1Y1M) = 13.** The **valueymd** function is
one-to-one and so it has an inverse function **valueymd ~-1~**. *E.g.,*
**valueymd ^-1^(13) = P1Y1M.**

#### Ternary logic

FEEL, like SQL and PMML, uses of ternary logic for truth values. This
makes **and** and **or** complete functions from ***D** x **D** →
**D***. Ternary logic is used in Predictive Modeling Markup Language to
model missing data values.

#### Lists and filters

Lists are immutable and may be nested. The *first* element of a list *L*
can be accessed using *L\[1\]* and the *last* element can be accessed
using *L\[-1\]*. The *n^th^* element from the beginning can be accessed
using *L\[n\],* and the *n^th^* element from the end can be accessed
using *L\[-n\]*.

If FEEL(*L*) = **L** is a list in the FEEL semantic domain, the first
element is FEEL(*L\[1\]*) = **L\[1\]**. If **L** does not contain **n**
items, then **L\[n\] is null**.

**L** can be filtered with a Boolean expression in square brackets. The
expression in square brackets can reference a list element using the
name *item*, unless the list element is a context that contains the key
**\"item\"**. If the list element is a context, then its context entries
may be referenced within the filter expression without the *\'item.\'*
prefix. For example: *\[1, 2, 3, 4\]\[item \> 2\] = \[3, 4\]*

> *\[ {x:1, y:2}, {x:2, y:3} \]\[x=1\] = \[{x:1, y:2}\]*

The filter expression is evaluated for each item in list, and a list
containing only items where the filter expression is **true** is
returned. E.g:

\[ {x:1, y:2}, {x:null, y:3} \]\[x \< 2\] = \[{x:1, y:2}\]

The expression to be filtered is subject to implicit conversions
(10.3.2.9.4) before the entire expression is evaluated.

For convenience, a selection using the \".\" operator with a list of
contexts on its left hand side returns a list of selections, *i.e.*
FEEL(*e.f,* **c**) = **\[** FEEL(*f*, **c\'**)**,** FEEL(*f*,
**c\"**)**, \... \]** where FEEL(*e*) = **\[ e\', e\", \... \]** and
**c\'** is **c** augmented with the context entries of **e\'**, **c\"**
is **c** augmented with the context entries of **e\"**, etc. For
example,

*\[ {x:1, y:2}, {x:2, y:3} \].y = \[2,3\]*

*\[ {x:1, y:2}, {x:2} \].y = \[ 2, null \]*

#### Context

A FEEL context is a partially ordered collection of (key, expression)
pairs called context entries. In the syntax, keys can be either names or
strings. Keys are mapped to strings in the semantic domain. These
strings are distinct within a context. A context in the domain is
denoted using bold FEEL syntax with string keys, *e.g.* **{ \"key1\" :
expr1, \"key2\" : expr2, \... }**.

The syntax for selecting the value of the entry named *key1* from
context-valued expression *m* is *m.key1.*

If *key1* is not a legal name or for whatever reason one wishes to treat
the key as a string, the following syntax is allowed: *get value(m,
\"key1 \").* Selecting a value by key from context **m** in the semantic
domain is denoted as **m.key1** or **get value(m, \"key1\")**

To retrieve a list of key, value pairs from a context *m*, the following
built-in function may be used*: get entries(m).* For example, the
following is true: *get entries({key1: \"value1 \"})\[key= \"key1
\"\].value = \"value1\"*

An expression in a context entry may not reference the key of the same
context entry but may reference keys (as QNs) from previous context
entries in the same context, as well as other values (as QNs) in scope.

These references SHALL be acyclic and form a partial order. The
expressions in a context SHALL be evaluated consistent with this partial
order.

#### Ranges

FEEL supports a compact syntax for a range of values, useful in decision
table test cells and elsewhere. Ranges can be syntactically represented
either:

a)  as a comparison operator and a single endpoint (grammar rule 7.a.)

b)  or a pair of endpoints and endpoint inclusivity flags that indicate
    whether one or both endpoints are included in the range (grammar
    rule 7.b.); on this case, endpoints must be of equivalent types (see
    section 10.3.2.9.1for the definition of type equivalence) and the
    endpoints must be ordered such that range start \<= range end.

Endpoints can be expressions (grammar rule 16) of the following types:
number, string, date, time, date and time, or duration. The following
are examples of valid ranges:

-   \< 10

-   \>= date("2019-03-31")

-   \>= @"2019-03-31"

-   \<= duration("PT01H")

-   \<= @"PT01H"

-   \[ 5 .. 10 \]

-   ( birthday .. @"2019-01-01" )

Ranges are mapped into the semantic domain as a typed instance of the
*range* type. If the syntax with a single endpoint and an operator is
used, then the other endpoint is undefined and the inclusivity flag is
set to false. E.g.:

+-------------+-------------+-------------+-------------+-------------+
| > **range** | > **start   | > **start** | > **end**   | **end       |
|             | >           |             |             | included**  |
|             |  included** |             |             |             |
+=============+=============+=============+=============+=============+
| > \[1..10\] | > true      | > 1         | > 10        | true        |
+-------------+-------------+-------------+-------------+-------------+
| > (1..10\]  | > false     | > 1         | > 10        | true        |
+-------------+-------------+-------------+-------------+-------------+
| > \<= 10    | > false     | > undefined | > 10        | true        |
+-------------+-------------+-------------+-------------+-------------+
| > \> 1      | > false     | > 1         | > undefined | false       |
+-------------+-------------+-------------+-------------+-------------+


The semantics of comparison expressions involving ranges (grammar rules
49c and 49d) is defined in Table 55, Table 54, Table 52, and Table 50.
The same rules apply when ranges are created programmatically, e.g.,
using the range function.

#### Functions

The FEEL function literal is given by grammar rule 55. Functions can
also be specified in **DMN** via Function Definitions (see 6.3.9). The
constructed type (*T*1, . . . , *Tn*) → *U* contains the function values
that take arguments of types *T1, . . . , Tn* and yield results of type
*U,* regardless of the way the function syntax (e.g., FEEL literal or
**DMN** Function Definition). In the case of exactly one argument type
*T* → *U* is a shorthand for (*T* ) → *U*.

#### Relations between types

Every FEEL expression executed in a certain context has a value in
**D**, and every value has a type. The FEEL types are organized as a
lattice (see Figure 10-26), with upper type *Any* and lower type *Null*.
The lattice determines the conformance of the different types to each
other. For example, because comparison is defined only between values
with conforming types, you cannot compare a number with a boolean or a
string.

We define **type(***e***)** as the type of the domain element
**FEEL(***e,* **c),** where *e* is an expression defined by grammar
rule 1. Literals for numbers, strings, booleans, null, date, time, date
and time and duration literals are mapped to the corresponding node in
lattice **L**. Complex expression such as list, contexts and functions
are mapped to the corresponding parameterized nodes in lattice **L**. .
For example, see **Table *43***.

+----------------------------------+-----------------------------------+
| *e*                              | > **type(***e***)**               |
+==================================+===================================+
| *123*                            | > number                          |
+----------------------------------+-----------------------------------+
| *true*                           | > boolean                         |
+----------------------------------+-----------------------------------+
| *\"abc\"*                        | > string                          |
+----------------------------------+-----------------------------------+
| *date(\"2017-01-01 \")*          | > date                            |
+----------------------------------+-----------------------------------+
| *\[\"a\", \"b\", \"c\"\]*        | > list\<string\>                  |
+----------------------------------+-----------------------------------+
| *\[\"a\", true, 123\]*           | > list\<Any\>                     |
+----------------------------------+-----------------------------------+
| \[1..10)                         | > range\<number\>                 |
+----------------------------------+-----------------------------------+
| \>= @"201 9-01-01"               | > range\<date\>                   |
+----------------------------------+-----------------------------------+
| e                                | > type(e)                         |
+----------------------------------+-----------------------------------+
| {\"name\": \"Peter\", age: 30}   | > context\<"age": number,         |
|                                  | > "name":string\>                 |
+----------------------------------+-----------------------------------+
| function f(x: number, y: number) | > (number, number) → number       |
| x + y                            |                                   |
+----------------------------------+-----------------------------------+
| DecisionA                        | > context\<"id":number,           |
|                                  | > "name":string\>                 |
+----------------------------------+-----------------------------------+
| BkmA                             | > (number, number) → number       |
+----------------------------------+-----------------------------------+


A type expression *e* defined by grammar rule 54 is mapped to the nodes
in the lattice **L** by function **type(***e***)** as follows: primitive
data type names are mapped to the node with the same name (e.g.,
*string* is mapped the **string** node)

• *Any* is mapped to the node **Any**

-   *Null* is mapped to the node **Null**

-   *list\< T\>* is mapped to the **list** node with the parameter
    **type(***T***)**

-   *context(k1:T1, \..., k~n~:T~n~\> where n≥1* is mapped to the
    **context** node with parameters k1: **type(***T1***)**, \..., k~n~:
    **type(***T~n~***)**

-   *function\< T1, \... T~n~\> -\> T* is mapped to the **function**
    node with signature **type(***T1***)**, \..., **type(***T~n~***)**
    -\> **type(***T***)**

-   Type names defined in the *itemDefinitions* section are mapped
    similarly to the context types (see rule above).

If none of the above rules can be applied (e.g., type name does not
exist in the decision model) the type expression is semantically
incorrect.\
We define two relations between types:

-   Equivalence (T ≡ S): Types T and S are interchangeable in all
    contexts.

Conformance (T \<:S): An instance of type T can be substituted at each
place where an instance of type S is expected.

##### Type Equivalence

The equivalence relationship (≡) between types is defined as follows:

-   Primitive datatypes are equivalent to themselves, e.g., string ≡
    string.

-   Two list types *list\< T\>* and *list\<S\>* are equivalent iff *T*
    is equivalent to *S*. For example, the types of \["a", "b"\] and
    \["c"\] are equivalent.

-   Two context types *context\<k~1~: T~1~, \..., k~n~: T~n~\>* and
    *context\<l~1~: S ~1~, \..., l~m~: S~m~\>* are equivalent iff n = m
    and for every *k~i~ :T~i~* there is a unique *l~j~ :S~j~* such that
    *k~i~ = l~j~* and *T~i~* ≡ *S~j~* for i = 1, n. Context types are
    the types defined via ItemDefinitions or the types associated to
    FEEL context literals such as { "name": "John", "age": 25}.

-   Two function types (*T~1~, \..., T~n~) →U* and (*S~1~, \..., S~m~)
    →V* are equivalent iff n = m, *T~i~* ≡ *S~j~* for i = 1, n and *U* ≡
    *V*.

-   Two range types *range\< T\>* and *range\<S\>* are equivalent iff
    *T* is equivalent to *S*. For example, the types of \[1..10\] and
    \[30..40\] are equivalent.

Type equivalence is transitive: if *type1* is equivalent to *type2*, and
*type2 is equivalent to type3*, then *type1* is equivalent to *type3*.

##### Type Conformance

The conformance relation (\<:) is defined as follows:

-   Conformance includes equivalence. If *T* ≡ *S* then *T* \<: *S*

-   For every type *T*, *Null* \<: *T* \<: *Any,* where *Null* is the
    lower type in the lattice and *Any* the upper type in the lattice.

-   The list type *list\< T\>* conforms to *list\<S\>* iff *T* conforms
    to *S.*

-   The context type *context\<k~1~: T~1~, \..., k~n~: T~n~\>* conforms
    to *context\<l~1~: S ~1~, \..., l~m~: S~m~\>* iff n ≥ m and for
    every *li : S~i~* there is a unique *~kj:Tj~* such that *l~i~ =
    k~j~* and *T~j~* \<: *S~i~* for i = 1, m

-   The function type (*T~1~, \..., T~n~) →U* conforms to type (*S~1~,
    \..., S~m~) →V* iff n = m, *S~i~* \<: *T~i~* for i = 1, n and *U*
    \<: *V*. The FEEL functions follow the "contravariant function
    argument type" and "covariant function return type" principles to
    provide type safety.

-   The range type *range\< T\>* conforms to *range\< S\>* iff T
    conforms to S. Type conformance is transitive: if *type1* conforms
    to *type2*, and *type2* conforms to *type3*, then *type1* conforms
    to *type3*.

![Diagram Description automatically
generated](media/image106.png){width="6.708333333333333in"
height="4.027777777777778in"}

**Figure 10-26: FEEL lattice type**

##### Examples

Let us consider the following ItemDefinitions:

> \<itemDefinition name=\"Employee1\"\> \<itemComponent name=\"id\"\>
>
> \<typeRef\>number\</typeRe f\> \</itemComponent\> \<itemComponent
> name=\"name\"\>
>
> \<typeRef\>string\</typeRef\>
>
> \</itemComponent\>
>
> \</itemDefinition\>
>
> \<itemDefinition name=\"Employee2\"\> \<itemComponent name=\"name\"\>
>
> \<typeRef\>string\</typeRe f\> \</itemComponent\>
>
> \<itemComponent name=\"id\"\>
>
> \<typeRef\>number\</typeRef\>
>
> \</itemCompone nt\>
>
> \</itemDefinition\>
>
> \<itemDefinition name=\"Employee3\"\> \<itemComponent name=\"id\"\>
>
> \<typeRef\>number\</typeRe f\> \</itemComponent\>
>
> \<itemComponent name=\"name\"\>
>
> \<typeRef\>string\</typeRef\>
>
> \</itemComponent\>
>
> \<itemComponent name=\"age\"\>
>
> \<typeRef\>number\</typeRe f\> \</itemComponent\>
>
> \</itemDefinition\>
>
> \<itemDefinition isCollection="true" name=\"Employee3List\"\>
>
> \<itemComponent name=\"id\"\>
>
> \<typeRef\>number\</typeRe f\> \</itemComponent\> \<itemComponent
> name=\"name\"\>
>
> \<typeRef\>string\</typeRef\>
>
> \</itemComponent\>
>
> \<itemComponent name=\"age\"\>
>
> \<typeRef\>number\</typeRe f\> \</itemComponent\>
>
> \</itemDefinition\>
>
> and the decisions *Decision1*, *Decision2, Decision3 and Decision4*
> with corresponding *typeRefs Employee1*, *Employee2,* *Employee3* and
> *Employee3List*.

Table 44 provides examples for *equivalence to* and *conforms to*
relations.

| **type1** | **type2** | **equivalent to** | **conforms to** |
|-----------|-----------|-------------------|-----------------|
| number | number | True | True |
| string | string | True | True |
| string | date | False | False |
| date | date and time | False | False |
| **type(***Decision 1***)** | **type(***Decision2***)** | True | True |
| **type(***Decision1***)** | **type(***Decision3***)** | False | False |
| **type(***Decision3***)** | **type(***Decision1***)** | False | True |
+-----------------+----------------+----------------+-----------------+
| > **t           | > **ty         | > True         | > True          |
| ype(***Decision | pe(***{\"id\": |                |                 |
| > 1***)**       | > 1,*          |                |                 |
|                 | >              |                |                 |
|                 | > *\"name \"   |                |                 |
|                 | > :\"          |                |                 |
|                 | Peter\"}***)** |                |                 |
+-----------------+----------------+----------------+-----------------+
| > **t           | **type(***D    | > False        | > False         |
| ype(***{\"id\": | ecision3***)** |                |                 |
| > 1,*           |                |                |                 |
| >               |                |                |                 |
| > *\"name \"    |                |                |                 |
| > :\            |                |                |                 |
| "Peter\"}***)** |                |                |                 |
+-----------------+----------------+----------------+-----------------+
| > **t           | **type(***D    | > False        | > True          |
| ype(***{\"id\": | ecision1***)** |                |                 |
| > 1,*           |                |                |                 |
| >               |                |                |                 |
| > *\"na         |                |                |                 |
| me\":\"Peter\", |                |                |                 |
| > \"age\":      |                |                |                 |
| > 45}***)**     |                |                |                 |
+-----------------+----------------+----------------+-----------------+
| > **t           | **type(***D    | > True         | > True          |
| ype(***{\"id\": | ecision3***)** |                |                 |
| > 1,*           |                |                |                 |
| >               |                |                |                 |
| > *\"na         |                |                |                 |
| me\":\"Peter\", |                |                |                 |
| > \"age\":      |                |                |                 |
| > 45}***)**     |                |                |                 |
+-----------------+----------------+----------------+-----------------+
| >               | **ty           | > False        | > False         |
|  **type***(\[1, | pe***(\[\"1\", |                |                 |
| > 2, 3\]**)***  | \"2\",         |                |                 |
|                 | \"3\"\]**)***  |                |                 |
+-----------------+----------------+----------------+-----------------+
| >               | **type(***D    | > False        | > False         |
|  **type***(\[1, | ecision3***)** |                |                 |
| > 2, 3\]**)***  |                |                |                 |
+-----------------+----------------+----------------+-----------------+
| > **typ         | **type(***D    | > True         | > True          |
| e(***\[{\"id\": | ecision4***)** |                |                 |
| > 1,*           |                |                |                 |
| >               |                |                |                 |
| > *\"na         |                |                |                 |
| me\":\"Peter\", |                |                |                 |
| > \"age\":      |                |                |                 |
| > 45}\]***)**   |                |                |                 |
+-----------------+----------------+----------------+-----------------+
| > **type(***    | > **type(***D  | > False        | > False         |
| Decision4***)** | ecision3***)** |                |                 |
+-----------------+----------------+----------------+-----------------+
| >               | **             | > True         | > True          |
| **type(***funct | type(***functi |                |                 |
| ion(x:Employee* | on(x:Employee* |                |                 |
| >               |                |                |                 |
| > *1 )          | *1 )           |                |                 |
| > →             | →E             |                |                 |
| Employee1***)** | mployee1***)** |                |                 |
+-----------------+----------------+----------------+-----------------+
| >               | **             | > True         | > True          |
| **type(***funct | type(***functi |                |                 |
| ion(x:Employee* | on(x:Employee* |                |                 |
| >               |                |                |                 |
| > *1 )          | *1 )           |                |                 |
| > →             | →E             |                |                 |
| Employee1***)** | mployee2***)** |                |                 |
+-----------------+----------------+----------------+-----------------+
| >               | **             | > False        | > True          |
| **type(***funct | type(***functi |                |                 |
| ion(x:Employee* | on(x:Employee* |                |                 |
| >               |                |                |                 |
| > *1 )          | *1 )           |                |                 |
| > →             | →E             |                |                 |
| Employee3***)** | mployee1***)** |                |                 |
+-----------------+----------------+----------------+-----------------+
| >               | **             | > False        | > False         |
| **type(***funct | type(***functi |                |                 |
| ion(x:Employee* | on(x:Employee* |                |                 |
| >               |                |                |                 |
| > *1 )          | *1 )           |                |                 |
| > →             | →E             |                |                 |
| Employee1***)** | mployee1***)** |                |                 |
+-----------------+----------------+----------------+-----------------+
| > **type(**     | > **type(**    | > True         | > True          |
| > \[1..10\]     | > (20..100)    |                |                 |
| > **)**         | > **)**        |                |                 |
+-----------------+----------------+----------------+-----------------+
| > **type1**     | > **type2**    | > equivalent   | > conforms to   |
|                 |                | > to           |                 |
+-----------------+----------------+----------------+-----------------+
| > **type(       | > **type(      | > False        | > False         |
| > \[1..10\] )** | > \["a".."x"\] |                |                 |
|                 | > )**          |                |                 |
+-----------------+----------------+----------------+-----------------+

##### Type conversions

The type of a FEEL expression *e* is determined from the value **e** =
FEEL(*e*, ***s***) in the semantic domain, where ***s*** is a set of
variable bindings (see 10.3.2.11and 10.3.2.12). When an expression
appears in a certain context it must be compatible with a type expected
in that context, called the *target type*. After the type of the
expression is deduced, an implicit conversion from the type of the
expression to the target type can be performed sometimes. If an implicit
conversion is mandatory but it cannot be performed the result is
**null**.

In implicit type conversions, the data type is converted automatically
without loss of information. There are several possible implicit type
conversions:

-   *to singleton list*:\
    > When the type of the expression is T and the target type is
    > List\<T\> the expression is converted to a singleton list.

-   *from singleton list*:\
    > When the type of the expression is List\<T\>, the value of the
    > expression is a singleton list and the target type is T, the
    > expression is converted by unwrapping the first element.

-   *from date to date and time*:\
    > When the type of the expression is date and the target type is
    > date and time, the expression is converted to a date time value in
    > which the time of day is UTC midnight (00:00:00).

There is one type of conversion to handle semantic errors:

-   *conforms to* (as defined in 10.3.2.9.2 Type Conformance):\
    > When the type of the expression is S, the target type is T, and S
    > conforms to T the value of expression remains unchanged. Otherwise
    > the result is **null**.

There are several kinds of contexts in which conversions may occur:

-   Filter context (10.3.2.5) in which a filter expression is present.
    > The expression to be filtered is subject to implicit conversion
    > *to singleton list*.

-   Invocation context (Table 63) in which an actual parameter is bound
    > to a formal parameter of a function. The actual parameter is
    > subject to implicit conversions.

-   Binding contexts in which the result of a DRG Element's logic is
    > bound to the output variable. If after applying the implicit
    > conversions the converted value and the target type do not
    > conform, the *conforms to* conversion is applied.

###### Examples

The table below contains several examples for singleton list
conversions.

+----------------------+----------------------+-----------------------+
| > **Expression**     | > **Conversion**     | > **Result**          |
+======================+======================+=======================+
| > *3\[item \> 2\]*   | *3* is converted to  | > **\[3\]**           |
|                      | *\[3\]* as this a    |                       |
|                      | filter context, and  |                       |
|                      | an *to singleton     |                       |
|                      | list* is applied     |                       |
+----------------------+----------------------+-----------------------+
| > *cont              | *\[\"foobar\"\]* is  | > **false**           |
| ains(\[\"foobar\"\], | converted to         |                       |
| > \"of\")*           | *\"foobar\"*, as     |                       |
|                      | this is an           |                       |
|                      | invocation context   |                       |
|                      | and *from singleton  |                       |
|                      | list* is applied     |                       |
+----------------------+----------------------+-----------------------+


In the example below, before binding variable *decision_003* to value
*\"123\"* the conversion to the target type (number) fails, hence the
variable is bound to *null*.

> \<**decision name=\"decision_003\" id=\"\_decision_003\"**\>
>
> \<**variable name=\"decision_003\" typeRef=\"number\"/\>**
>
> \<**literalExpression**\>
>
> \<**text**\>"*"123*"\</**text**\>
>
> \</**literalExpression**\>

\</**decision**\>

#### Decision Table

The normative notation for decision tables is specified in Clause 8.
Each input expression SHALL be a textual expression (grammar rule 2).
Each list of input values SHALL be an instance of unary tests (grammar
rule 15). The value that is tested is the value of the input expression
of the containing InputClause. Each list of output values SHALL be an
instance of unary tests (grammar rule 15). The value that is tested is
the value of a selected output entry of the containing OutputClause.
Each input entry SHALL be an instance of unary tests (grammar rule 15).
Rule annotations are ignored in the execution semantics.

The decision table components are shown in Figure 8-5: Rules as rows --
schematic layout, and also correspond to the metamodel in clause 8.3 For
convenience, Figure 8-5 is reproduced here.

+----+---------------------+----------------------+-------------------+
| *  |                     |                      |                   |
| *i |                     |                      |                   |
| nf |                     |                      |                   |
| or |                     |                      |                   |
| ma |                     |                      |                   |
| ti |                     |                      |                   |
| on |                     |                      |                   |
| it |                     |                      |                   |
| em |                     |                      |                   |
| na |                     |                      |                   |
| me |                     |                      |                   |
| ** |                     |                      |                   |
+====+=====================+======================+===================+
| >  | > input expression  | > input expression 2 | Output label      |
|  H | > 1                 |                      |                   |
+----+---------------------+----------------------+-------------------+
|    | input value 1a,     | input value 2a,      | > output value    |
|    |                     |                      | > 1a, output      |
|    | > input value 1b    | > input value 2b     | > value 1b        |
+----+---------------------+----------------------+-------------------+
| >  | > input entry 1.1   | > input entry 2.1    | output entry 1.1  |
|  1 |                     |                      |                   |
+----+---------------------+----------------------+-------------------+
| >  |                     | > input entry 2.2    | output entry 1.2  |
|  2 |                     |                      |                   |
+----+---------------------+----------------------+-------------------+
| >  | > input entry 1.2   | > \-                 | output entry 1.3  |
|  3 |                     |                      |                   |
+----+---------------------+----------------------+-------------------+


The semantics of a decision table is specified by first composing its
literal expressions and unary tests into Boolean expressions that are
mapped to the semantic domain and composed into rule matches then rule
hits. Finally, some of the decision table output expressions are mapped
to the semantic domain and comprise the result of the decision table
interpretation. Decision table components are detailed in Table 46.

+----------------------------------+-----------------------------------+
| > **Component name (\* means     | > **Description**                 |
| > optional)**                    |                                   |
+==================================+===================================+
| > input expression               | One of the N\>=0 input            |
|                                  | expressions, each a literal       |
|                                  | expression                        |
+----------------------------------+-----------------------------------+
| > input values\*                 | One of the N input values,        |
|                                  | corresponding to the N input      |
|                                  | expressions. Each is a unary      |
|                                  | tests literal (see below).        |
+----------------------------------+-----------------------------------+
| > output values\*                | A unary tests literal for the     |
|                                  | output.                           |
|                                  |                                   |
|                                  | (In the event of M\>1 output      |
|                                  | components (see Figure 8-12),     |
|                                  | each output component may have    |
|                                  | its own output values)            |
+----------------------------------+-----------------------------------+
| > rules                          | a list of R\>0 rules. A rule is a |
|                                  | list of N input entries followed  |
|                                  | by M output entries. An input     |
|                                  | entry is a unary tests literal.   |
|                                  | An output entry is a literal      |
|                                  | expression.                       |
+----------------------------------+-----------------------------------+
| > hit policy\*                   | one of: \"U\", \"A\", "P", "F",   |
|                                  | \"R\", \"O\", \"C\", \"C+\",      |
|                                  | \"C#\", \"C\<\",                  |
|                                  |                                   |
|                                  | "C\>" (default is \"U\")          |
+----------------------------------+-----------------------------------+
| > default output value\*         | The default output value is one   |
|                                  | of the output values. If M\>1,    |
|                                  | then default output value is a    |
|                                  | context with entries composed of  |
|                                  | output component names and output |
|                                  | values.                           |
+----------------------------------+-----------------------------------+


Unary tests (grammar rule 15) are used to represent both input values
and input entries. An input expression *e* is said to *satisfy* an input
entry *t* (with optional input values *v*), depending on the syntax of
*t*, as follows:

-   grammar rule 15.a: FEEL(*e in (t)*)**=true**

-   grammar rule 15.b: FEEL(*e in (t)*)**=false**

-   grammar rule 15.c when *v* is not provided: **e != null**

-   grammar rule 15.c when *v* is provided: FEEL(*e in (v)*)**=true**

A rule with input entries *t1,t2,\...,tN* is said to *match* the input
expression list *\[e1,e2,\...,eN\]* (with optional input values list
*\[v1,v2, \...vN\]*) if *ei satisfies ti* (with optional input values
*vi*) for all *i* in 1..N.

A rule is *hit* if it is matched, and the hit policy indicates that the
matched rule\'s output value should be included in the decision table
result. Each hit results in one output value (multiple outputs are
collected into a single context value). Therefore, multiple hits require
aggregation.

The hit policy is specified using the initial letter of one of the
following boldface policy names.

Single hit policies:

-   **Unique** -- only a single rule can be matched.

-   **Any** -- multiple rules can match, but they all have the same
    > output,

-   **Priority** -- multiple rules can match, with different outputs.
    > The output that comes first in the supplied *output values* list
    > is returned,

-   **First** -- return the first match in rule order,

Multiple hit policies:

-   **Collect** -- return a list of the outputs in arbitrary order,

-   **Rule order** -- return a list of outputs in rule order,

-   **Output order** -- return a list of outputs in the order of the
    > *output values* list

The Collect policy may optionally specify an *aggregation*, as follows:

-   **C+** -- return the sum of the outputs

-   **C#** -- return the count of the outputs

-   **C\<** -- return the minimum-valued output

-   **C\>** -- return the maximum-valued output

The *aggregation* is defined using the following built-in functions
specified in clause 10.3.4.4: *sum, count, minimum, maximum*. To reduce
complexity, decision tables with compound outputs do not support
aggregation and support only the following hit policies: *Unique*,
*Any*, *Priority, First*, *Collect without operator*, and *Rule order*.

A decision table may have no rule hit for a set of input values. In this
case, the result is given by the default output value, or **null** if no
default output value is specified. A complete decision table SHALL NOT
specify a default output value.

The semantics of a decision table invocation **DTI** are as follows:

1.  Every rule in the rule list is matched with the input expression
    list. Matching is unordered.

2.  If no rules match,

    a.  if a default output value *d* is specified, **DTI=**FEEL(*d*)

    b.  else **DTI=null**.

3.  Else let *m* be the sublist of rules that match the input expression
    list. If the hit policy is \"First\" or \"Rule order\", order *m* by
    rule number.

    a.  Let *o* be a list of output expressions, where the expression at
        index *i* is the output expression from rule *m\[i\]*. The
        output expression of a rule in a single output decision table is
        simply the rule\'s output entry. The output expression of a
        multiple output decision table is a context with entries
        composed from the output names and the rule\'s corresponding
        output entries. If the hit policy is \"Output order\", the
        decision table SHALL be single output and *o* is ordered
        consistent with the order of the *output values*. Rule
        annotations are ignored for purposes of determining the
        expression value of a decision table.

    b.  If a multiple hit policy is specified, DTI=FEEL(aggregation(o)),
        where aggregation is one of the built-in functions *sum, count,
        minimum* as specified in clause 10.3.4.4.

    c.  else **DTI=**FEEL(*o\[1\]*).

#### Scope and context stack

A FEEL expression *e* is always evaluated in a well-defined set of name
bindings that are used to resolve QNs in *e*. This set of name bindings
is called the scope of *e*. Scope is modeled as a list of contexts. A
scope **s** contains the contexts with entries that are in scope for
*e*. The last context in **s** is the *built-in* context. Next to last
in **s** is the *global* context. The first context in **s** is the
context immediately containing *e* (if any). Next are enclosing contexts
of *e* (if any).

The QN of *e* is the QN of the first context in **s** appended with .N,
where N is the name of entry in the first context of **s** containing
*e.* QNs in *e* are resolved by looking through the contexts in **s**
from first to last.

##### Local context

If *e* denotes the value of a context entry of context **m**, then **m**
is the local context for *e*, and **m** is the first element of **s.**
Otherwise, *e* has no local context and the first element of **s** is
the global context, or in some cases explained later, the first element
of **s** is a special context.

All of the entries of **m** are in-scope for *e*, but the *depends on*
graph SHALL be acyclic. This provides a simple solution to the problem
of the confusing definition above: if **m** is the result of evaluating
the context expression *m* that contains *e*, how can we know it in
order to evaluate *e*? Simply evaluate the context entries in *depends
on* order.

##### Global context

The global context is a context created before the evaluation of *e* and
contains names and values for the variables defined outside expression
*e* that are accessible in *e*. For example, when *e* is the body of a
decision *D*, the global context contains entries for the information
requirements and knowledge requirements of *D* (*i.e.,* names and logic
of the business knowledge models, decisions and decision services
required by *D)*.

##### Built-in context

The built-in context contains all the built-in functions.

##### Special context

Some FEEL expressions are interpreted in a *special* context that is
pushed on the front of **s**. For example, a filter expression is
repeatedly executed with special first context containing the name
\'item\' bound to successive list elements. A function is executed with
a special first context containing argument name-\>value mappings.

Qualified names (QNs) in FEEL expressions are interpreted relative to
**s**. The meaning of a FEEL expression *e* in scope **s** is denoted as
**FEEL(***e,* **s)**. We can also say that *e* evaluates to **e** in
scope **s**, or **e** = **FEEL(***e,* **s)**. Note that **e** and **s**
are elements of the FEEL domain. **s** is a list of contexts.

#### Mapping between FEEL and other domains

A FEEL expression *e* denotes a value **e** in the semantic domain. Some
kinds of values can be passed between FEEL and external Java methods,
between FEEL and external PMML models, and between FEEL and XML, as
summarized in Table 47. An empty cell means that no mapping is defined.

+-----------+------------------+---------------+----------------------+
| > ***FEEL | > ***Java***     | > ***XML***   | > ***PMML***         |
| >         |                  |               |                      |
|  value*** |                  |               |                      |
+===========+==================+===============+======================+
| > number  | > java           | > decimal     | > decimal,           |
|           | .math.BigDecimal |               | > PROB-NUMBER,       |
|           |                  |               | >                    |
|           |                  |               | > PERCENTAGE-NUMBER  |
+-----------+------------------+---------------+----------------------+
|           |                  | > integer     | > integer ,          |
|           |                  |               | > INT-NUMBER         |
+-----------+------------------+---------------+----------------------+
|           |                  | > double      | > double,            |
|           |                  |               | > REAL-NUMBER        |
+-----------+------------------+---------------+----------------------+
| > string  | >                | > string      | > string, FIELD-NAME |
|           | java.lang.String |               |                      |
+-----------+------------------+---------------+----------------------+
| > date,   | > jav            | > date,       | > date, dateTime,    |
| > time,   | ax.xml.datatype. | > dateTime,   | > time conversion    |
| > date    | >                | > time,       | > required for       |
| > and     | > XMLG           | >             | > dateDaysSince,     |
| > time    | regorianCalendar | dateTimestamp | > *et. al.*          |
+-----------+------------------+---------------+----------------------+
| >         | > jav            | > yearM       |                      |
|  duration | ax.xml.datatype. | onthDuration, |                      |
|           | >                | > da          |                      |
|           | > Duration       | yTimeDuration |                      |
+-----------+------------------+---------------+----------------------+
| > boolean | > j              | > boolean     | > boolean            |
|           | ava.lang.Boolean |               |                      |
+-----------+------------------+---------------+----------------------+
| > list    | > java.util.List | > contain     | > array              |
|           |                  | > multiple    | > (homogeneous)      |
|           |                  | > child       |                      |
|           |                  | > elements    |                      |
+-----------+------------------+---------------+----------------------+
| > context | > java.util.Map  | > contain     |                      |
|           |                  | > attributes  |                      |
|           |                  | > and child   |                      |
|           |                  | > elements    |                      |
+-----------+------------------+---------------+----------------------+


Sometimes we do not want to evaluate a FEEL expression *e*, we just want
to know the type of **e***.* Note that if *e* has QNs, then a context
may be needed for type inference. We write **type(***e***)** as the type
of the domain element **FEEL(***e,* **c)**.

#### Functions Seamantics

FEEL functions can be:

-   built-in, *e.g.*, *sum* (see clause 10.3.4.4), or

-   user-defined, *e.g., function(age) age \< 21*, or

-   externally defined, *e.g.*, *function(angle) external {*

> *java: {*
>
> *class: "java.lang.Math ", method signature: "cos(double)" }}*

##### Built-in Functions

The built-in functions are described in detail in section 10.3.4. In
particular, function signatures and parameter domains are specified.
Some functions have more than one signature.

Built-in functions are invoked using the same syntax as other functions
(grammar rule 40). The actual parameters must conform to the parameter
domains in at least one signature before or after applying implicit
conversions, or the result of the invocation is **null**.

##### User-defined functions

User-defined functions (grammar rule 55) have the form *function(X1,
\... Xn) body*

The terms *X1, \... Xn* are formal parameters. Each formal parameter has
the form *ni* or *ni* :*ti*, where the *ni* are the parameter names and
*ti* are their types. If the type isn't specified, *Any* is assumed. The
meaning of

FEEL(*function(X1, \... X~n~) body*, **s**) is an element in the FEEL
semantic domain that we denote as **function(argument list: \[***X1,
\... X~n~***\], body:** *body***, scope: s)** (shortened to **f**
below). FEEL functions are lexical closures, *i.e.,* the *body* is an
expression that references the formal parameters and any other names in
scope **s**.

User-defined functions are invoked using the same syntax as other
functions (grammar rule 38). The meaning of an invocation
*f(n1:e1,*\...*,nn:en)* in scope **s** is FEEL(*f,* **s**) applied to
arguments *n1:*FEEL(*e1,* **s**)\... *,nn:*FEEL(*en,* **s**). This can
also be written as **f(n**1:**e**1\... *,***n**~n~:**e**~n~).

The arguments **n**1:**e**1\... *,***n**~n~:**e**~n~ conform to the
argument list **\[***X1, \... X~n~***\]** if **type(e**i**)** conforms
to *ti* before or after applying implicit conversions or *ti* is not
specified in *Xi*, for all *i* in *1. .n.* The result of applying **f**
to the interpreted arguments **n**1:**e**1\... *,***n**~n~:**e**~n~ is
determined as follows. If **f** is not a function, or if the arguments
do not conform to the argument list, the result of the invocation is
**null**. Otherwise, let **c** be a context with entries
**n**1:**e**1\... *,***n**~n~:**e**~n~. The result of the invocation is
FEEL(*body, **s'***), where **s\'** = insert before(**s**, 1, **c**)
(see 10.3.4.4).

Invocable elements (Business Knowledge Models or Decision Services) are
invoked using the same syntax as other functions (grammar rule 38). An
Invocable is equivalent to a FEEL function whose parameters are the
invocable's inputs (see 10.4)

##### Externally-defined functions

FEEL externally-defined functions have the following form *function (X1,
\... X~n~) external mapping-information*

Mapping-information is a context that SHALL have one of the following
forms:

> *{*
>
> *java: {class: class-name, method signature: method-signature}*
>
> *}*

or

> *{*
>
> *pmml: {document: IRI, model: model-name}*
>
> *}*

The meaning of an externally defined function is an element in the
semantic domain that we denote as **function(argument list: \[***X1,
\... X~n~***\], external: mapping-information)**.

The *java* form of the mapping information indicates that the external
function is to be accessed as a method on a Java class. The *class-name*
SHALL be the string name of a Java class on the classpath. Classpath
configuration is implementation-defined. The *method-signature* SHALL be
a string consisting of the name of a public static method in the named
class, followed by an argument list containing only Java argument type
names. The argument type information SHOULD be used to resolve
overloaded methods and MAY be used to detect out-of-domain errors before
runtime.

The *pmml* form of the mapping information indicates that the external
function is to be accessed as a PMML model. The *IRI* SHALL be the
resource identifier for a PMML document. The *model-name* is optional.
If the *model-name* is specified, it SHALL be the name of a model in the
document to which the *IRI* refers. If no *model-name* is specified, the
external function SHALL be the first model in the document.

When an externally-defined function is invoked, actual argument values
and result value are converted when possible, using the type mapping
table for Java or PMML (see Table 47). When a conversion is not
possible, **null** is substituted. If a result cannot be obtained,
*e.g.,* an exception is thrown, the result of the invocation is
**null**. If the externally-defined function is of type PMML, and PMML
invocation results in a single predictor output, the result of the
externally-defined function is the single predictor output\'s value.

Passing parameter values to the external method or model requires
knowing the expected parameter types. For Java, this information is
obtained using reflection. For PMML, this information is obtained from
the mining schema and data dictionary elements associated with
independent variables of the selected model.

Note that **DMN** does not completely define the semantics of a Decision
Model that uses externally-defined functions. Externally-defined
functions SHOULD have no side-effects and be deterministic.

##### Function name

To name a function, define it as a context entry. For example:

> *{ isPositive : function(x) x \> 0,*
>
> *isNotNegative : function(x) isPositive(x+*
>
> *1), result: isNotNegative(0)*

*}*

##### Positional and named parameters

An invocation of any FEEL function (built-in, user-defined, or
externally-defined) can use positional parameters or named parameters.
If positional, all parameters SHALL be supplied. If named, unsupplied
parameters are bound to **null**.

#### For loop expression

The *for loop expression* iterates over lists of elements or ranges of
numbers or dates. The general syntax is:

> *for i~1~ in ic~1~ \[, i~2~ in ic~2~ \[, \...\]\] return e*

where:

-   *ic~1~, ic~2~, \..., ic~n~* are *iteration contexts*

-   *i~1~, i~2~, \..., i~n~* are variables bound to each element in the
    *iteration context*

-   *e* is the **return** expression

An *iteration context* may either be an expression that returns a list
of elements, or two expressions that return integers connected by "..".
Examples of valid iteration contexts are:

-   \[ 1, 2, 3\]

-   a list

-   1..10

-   50..40

-   x..x+10

-   @"2021-01-01"..@"2022-01-01"

A *for loop expression* will iterate over each element in the *iteration
context*, binding the element to the corresponding variable *i~n~* and
evaluating the expression *e* in that scope.

When the *iteration context* is a range of numbers, the *for loop
expression* will iterate over the range incrementing or decrementing the
value of *i~n~* by 1, depending if the range is ascendant (when the
resulting integer from the first expression is lower than the second) or
descendant (when the resulting integer from the first expression is
higher than the second).

When the *iteration context* is a range of dates, the *for loop
expression* will iterate over the range incrementing or decrementing the
value of i ~n~ by 1 day, depending if the range is ascendant (when the
resulting date from the first expression is lower than the second) or
descendant (when the resulting date from the first expression is higher
than the second).

The result of the *for loop expression* is a list containing the result
of the evaluation of the expression *e* for each individual iteration in
order.

The expression *e* may also reference an implicitly defined variable
called "***partial***" that is a list containing all the results of the
previous iterations of the expression. The variable "***partial***" is
immutable. E.g.: to calculate the factorial list of numbers, from 0 to
N, where N is a non-negative integer, one may write:

> *for i in 0..N return if i = 0 then 1 else i \* partial\[-1\]*

When multiple *iteration contexts* are defined in the same *for loop
expression*, the resulting iteration is a crossproduct of the elements
of the *iteration contexts*. The iteration order is from the inner
*iteration context* to the outer *iteration context*.

E.g., the result of the following *for loop expression* is:

> *for i in \[i~1~,i~2~\], j in \[j~1~j~2~\] return e **= \[ r~1~, r~2~,
> r~3~, r~4~ \]***

Where:

> ***r~1~ = FEEL( e, { i: i~1~, j: j~1~, partial:\[\], \... } ) r~2~ =
> FEEL( e, { i: i~1~, j: j~2~, partial:\[r~1~\], \... ) r~3~ = FEEL( e,
> { i: i~2~, j: j~1~, partial:\[r~1~,r~2~\], \... } )***

***r~4~ = FEEL( e, { i: i~2~, j: j~2~, partial:\[r~1~,r~2~,r~3~\], \...
} )***

#### Semantic mappings

The meaning of each substantive grammar rule is given below by mapping
the syntax to a value in the semantic domain. The value may depend on
certain input values, themselves having been mapped to the semantic
domain. The input values may have to obey additional constraints. The
input domain(s) may be a subset of the semantic domain. Inputs outside
of their domain result in a **null** value unless the implicit
conversion *from singleton list* (10.3.2.9.4) can be applied.

+----------+---------------------+-------------------------------------+
| > *      | > **FEEL Syntax**   | > **Mapped to Domain**              |
| *Grammar |                     |                                     |
| > Rule** |                     |                                     |
+==========+=====================+=====================================+
| > 55     | > *function(n1,     | > **function(argument list:         |
|          | > \...nN) e*        | > \[***n1, \... nN***\], body:**    |
|          |                     | > *e***, scope: s)**                |
+----------+---------------------+-------------------------------------+
| > 55     | > *function(n1,     | **function(argument list: \[***n1,  |
|          | > \...nN) external  | \... nN***\], external: e)**        |
|          | > e*                |                                     |
+----------+---------------------+-------------------------------------+


See 10.3.2.7.

+----------+---------------------+-------------------------------------+
| > **G    | > **FEEL Syntax**   | > **Mapped to Domain**              |
| rammar** |                     |                                     |
| >        |                     |                                     |
| >        |                     |                                     |
| **Rule** |                     |                                     |
+==========+=====================+=====================================+
| > 44     | *for i~1~ in ic~1~, | > **\[ FEEL(***e*, **s\'),          |
|          | i~2~ in ic~2~, \... | > FEEL(***e*, **si, \... \]**       |
|          | return e*           |                                     |
+----------+---------------------+-------------------------------------+
| > 45     | > *if e1 then e2    | > **if FEEL(***e1***) is true then  |
|          | > else e3*          | > FEEL(***e2***) else               |
|          |                     | > FEEL(***e3***)**                  |
+----------+---------------------+-------------------------------------+
| > 46     | > *some n1 in e1,   | > **false or FEEL(***e,* **s\') or  |
|          | > n2 in e2, \...*   | > FEEL(***e,* **s\") or \...**      |
|          | >                   |                                     |
|          | > *satisfies e*     |                                     |
+----------+---------------------+-------------------------------------+
| > 46     | > *every n 1 in e   | > **true and FEEL(***e,* **s\') and |
|          | > 1, n2 in e2,      | > FEEL(***e,* **s\") and \...**     |
|          | > \...*             |                                     |
|          | >                   |                                     |
|          | > *satisfies e*     |                                     |
+----------+---------------------+-------------------------------------+
| > 47     | > *e1 or e2 or      | > **FEEL(***e1***) or               |
|          | > \...*             | > FEEL(***e2***) or** \...          |
+----------+---------------------+-------------------------------------+
| > 48     | > *e1 and e2 and    | > **FEEL(***e1***) and              |
|          | > \...*             | > FEEL(***e2***) and** \...         |
+----------+---------------------+-------------------------------------+
| 49.a     | > *e = null*        | > **FEEL(***e***) is null**         |
+----------+---------------------+-------------------------------------+
| 49.a     | > *null = e*        | > **FEEL(***e***) is null**         |
+----------+---------------------+-------------------------------------+
| 49.a     | > *e != null*       | > **FEEL(***e***) is not null**     |
+----------+---------------------+-------------------------------------+
| 49.a     | > *null != e*       | > **FEEL(e) is not null**           |
+----------+---------------------+-------------------------------------+


Notice that we use bold syntax to denote contexts, lists, conjunctions,
disjunctions, conditional expressions, true, false, and null in the FEEL
domain.

The meaning of the conjunction **a and b** and the disjunction **a or
b** is defined by ternary logic. Because these are total functions, the
input can be **true**, **false**, or **otherwise** (meaning any element
of **D** other than **true** or **false**).

A conditional **if a then b else c** is equal to **b** if **a** is
**true**, and equal to **c** otherwise.

**s\'** is the scope **s** with a special first context containing keys
n1, n2, etc. bound to the first element of the Cartesian product of
FEEL**(***e1***) x** FEEL**(***e2***) x \..., s\"** is **s** with a
special first context containing keys bound to the second element of the
Cartesian product, *etc*. When the Cartesian product is empty, the *some
\... satisfies* quantifier returns **false** and the *every \...
satisfies* quantifier returns **true**.

+--------------------+--------------------+-------------+-------------+
| > **a**            | **b**              | **a and b** | **a or b**  |
+====================+====================+=============+=============+
| > true             | true               | true        | true        |
+--------------------+--------------------+-------------+-------------+
| > true             | false              | false       | true        |
+--------------------+--------------------+-------------+-------------+
| > true             | otherwise          | null        | true        |
+--------------------+--------------------+-------------+-------------+
| > false            | true               | false       | true        |
+--------------------+--------------------+-------------+-------------+
| > false            | false              | false       | false       |
+--------------------+--------------------+-------------+-------------+
| > false            | otherwise          | false       | null        |
+--------------------+--------------------+-------------+-------------+
| > otherwise        | true               | null        | true        |
+--------------------+--------------------+-------------+-------------+
| > otherwise        | false              | false       | null        |
+--------------------+--------------------+-------------+-------------+
| > otherwise        | otherwise          | null        | null        |
+--------------------+--------------------+-------------+-------------+


Negation is accomplished using the built-in function **not**. The
ternary logic is as shown in Table 51.

**Table 51: Semantics of negation**

+-----------------------------+----------------------------------------+
| > **a**                     | **not(a)**                             |
+=============================+========================================+
| > true                      | false                                  |
+-----------------------------+----------------------------------------+
| > false                     | true                                   |
+-----------------------------+----------------------------------------+
| > otherwise                 | null                                   |
+-----------------------------+----------------------------------------+


Equality and inequality map to several kind- and datatype-specific
tests, as shown in Table 52, Table 53 and Table 54. By definition,
FEEL(*e1 != e2*) is FEEL(*not(e 1= e2)*). The other comparison operators
are defined only for the datatypes listed in Table 54. Note that Table
54 defines only '\<'; '\>' is similar to '\<' and is omitted for
brevity; *e1\<=e2* is defined as *e1\< e2 or e1= e2.*

+----------+--------------+---------------------+----------------------+
| > *      | > **FEEL     | > **Input Domain**  | > **Result**         |
| *Grammar | > Syntax**   |                     |                      |
| > Rule** |              |                     |                      |
+==========+==============+=====================+======================+
| > 49.a   | > *e1 = e2*  | **e1 and e2 must    | > *See below*        |
|          |              | both be of the same |                      |
|          |              | kind/datatype --    |                      |
|          |              | both numbers, both  |                      |
|          |              | strings, etc.**     |                      |
+----------+--------------+---------------------+----------------------+
| > 49.a   | > *e1 \< e2* | **e1** and **e2**   | > *See below*        |
|          |              | must both be of the |                      |
|          |              | same kind/datatype  |                      |
|          |              | -- both numbers,    |                      |
|          |              | both strings,       |                      |
|          |              | *etc.*              |                      |
+----------+--------------+---------------------+----------------------+


+-------------------------+--------------------------------------------+
| > **kind/datatype**     | ***e1 = e2***                              |
+=========================+============================================+
| > list                  | lists must be same length N and **e1\[i\]  |
|                         | = e2\[i\]** for 1 ≤ **i** ≤ N.             |
+-------------------------+--------------------------------------------+
| > context               | contexts must have same set of keys K and  |
|                         | **e1.k = e2.k** for every k in K           |
+-------------------------+--------------------------------------------+
| > range                 | the ranges must specify the same           |
|                         | endpoint(s) and the same comparison        |
|                         | operator or endpoint inclusivity flag.     |
+-------------------------+--------------------------------------------+
| > function              | internal functions must have the same      |
|                         | parameters, body, and scope. Externally    |
|                         | defined functions must have the same       |
|                         | parameters and external mapping            |
|                         | information.                               |
+-------------------------+--------------------------------------------+
| > number                | **value(e1) = value(e2)**. Value is        |
|                         | defined in 10.3.2.3.1. Precision is not    |
|                         | considered.                                |
+-------------------------+--------------------------------------------+
| > string                | > **e1** is the same sequence of           |
|                         | > characters as **e2**                     |
+-------------------------+--------------------------------------------+
| > date                  | > **value(e1) = value(e2)**. Value is      |
|                         | > defined in 10.3.2.3.5                    |
+-------------------------+--------------------------------------------+
| > date and time         | > **value(e1) = value(e2)**. Value is      |
|                         | > defined in 10.3.2.3.6                    |
+-------------------------+--------------------------------------------+
| > time                  | > **value(e1) = value(e2)**. Value is      |
|                         | > defined in 10.3.2.3.4.                   |
+-------------------------+--------------------------------------------+
| > days and time         | > **value(e1) = value(e2)**. Value is      |
| > duration              | > defined in 10.3.2.3.7                    |
+-------------------------+--------------------------------------------+
| > years and months      | > **value(e1) = value(e2)**. Value is      |
| > duration              | > defined in 10.3.2.3.8.                   |
+-------------------------+--------------------------------------------+
| > boolean               | > **e1** and **e2** must both be **true**  |
|                         | > or both be **false**                     |
+-------------------------+--------------------------------------------+


+-------------------------+--------------------------------------------+
| > **datatype**          | > ***e1 \< e2***                           |
+=========================+============================================+
| number                  | > **value(e1) \< value(e2)**. **value** is |
|                         | > defined in 10.3.2.3.1. Precision is not  |
|                         | > considered.                              |
+-------------------------+--------------------------------------------+
| string                  | > sequence of characters **e1** is         |
|                         | > lexicographically less than the sequence |
|                         | > of characters **e2**. *I.e.,* the        |
|                         | > sequences are padded to the same length  |
|                         | > if needed with *\\u0* characters,        |
|                         | > stripped of common prefix characters,    |
|                         | > and then the first character in each     |
|                         | > sequence is compared.                    |
+-------------------------+--------------------------------------------+
| > date                  | > e1 \< e2 if the year value of e1 \< the  |
|                         | > year value of e2 e1 \< e2 if the year    |
|                         | > values are equal and the month value of  |
|                         | > e1 \< the month value of e2 e1 \< e2 if  |
|                         | > the year and month values are equal and  |
|                         | > the day value of e1 \< the day value of  |
|                         | > e2                                       |
+-------------------------+--------------------------------------------+
| > date and time         | > **valuedt(e1) \< valuedt(e2)**.          |
|                         | > **valuedt** is defined in 10.3.2.3.5. If |
|                         | > one input has a null timezone offset,    |
|                         | > that input uses the timezone offset of   |
|                         | > the other input.                         |
+-------------------------+--------------------------------------------+
| > time                  | > **valuet(e1) \< valuet(e2)**. **valuet** |
|                         | > is defined in 10.3.2.3.4. If one input   |
|                         | > has a null timezone offset, that input   |
|                         | > uses the timezone offset of the other    |
|                         | > input.                                   |
+-------------------------+--------------------------------------------+
| > days and time         | > **valuedtd(e1) \< valuedtd(e2)**.        |
| > duration              | > **valuedtd** is defined in 10.3.2.3.7.   |
+-------------------------+--------------------------------------------+
| > years and months      | > **valueymd(e1) \< valueymd(e2)**.        |
| > duration              | > **valueymd** is defined in 10.3.2.3.8.   |
+-------------------------+--------------------------------------------+


FEEL supports additional syntactic sugar for comparison. Note that
Grammar Rules (clause 10.3.1.2) are used in decision table condition
cells. These decision table syntaxes are defined in Table 55.

+---------+----------------+---------------------+--------------------+
| > **Gr  | > **FEEL       | > **Equivalent FEEL | >                  |
| ammar** | > Syntax**     | > Syntax**          |  **applicability** |
| >       |                |                     |                    |
| > *     |                |                     |                    |
| *Rule** |                |                     |                    |
+=========+================+=====================+====================+
| 49.b    | > *e1 between  | > *e1 \>= e2 and e1 |                    |
|         | > e2 and e3*   | > \<= e3*           |                    |
+---------+----------------+---------------------+--------------------+
| 49.c    | > *e1 in       | > *e1 = e2 or e1 =  | > e2 and e3 are    |
|         | > \[e2,e3,     | > e3 or\...*        | > endpoints        |
|         | > \... \]*     |                     |                    |
+---------+----------------+---------------------+--------------------+
| 49.c    | > *e1 in       | > *e1 in e2 or e1   | > e2 and e3 are    |
|         | > \[e2,e3,     | > in e3 or\...*     | > ranges           |
|         | > \... \]*     |                     |                    |
+---------+----------------+---------------------+--------------------+
| 49.c    | > *e1 in       | > *e1 \<= e2*       |                    |
|         | > \<=e2*       |                     |                    |
+---------+----------------+---------------------+--------------------+
| 49.c    | > *e1 in \<e2* | > *e1 \< e2*        |                    |
+---------+----------------+---------------------+--------------------+
| 49.c    | > *e1 in       | > *e1 \>= e2*       |                    |
|         | > \>=e2*       |                     |                    |
+---------+----------------+---------------------+--------------------+
| 49.c    | > *e1 in \>e2* | > *e1 \> e2*        |                    |
+---------+----------------+---------------------+--------------------+
| 49.c    | > *e1 in       | > *e1 \> e2 and     |                    |
|         | > (e2..e3)*    | > e1\<e3*           |                    |
+---------+----------------+---------------------+--------------------+
| 49.c    | > *e1 in       | > *e1 \> e2 and     |                    |
|         | > (e2..e3\]*   | > e1\<=e3*          |                    |
+---------+----------------+---------------------+--------------------+
| 49.c    | > *e1 in       | > *e1 \>= e2 and    |                    |
|         | > \[e2..e3)*   | > e1\<e3*           |                    |
+---------+----------------+---------------------+--------------------+
| 49.c    | > *e1 in       | > *e1 \>= e2 and    |                    |
|         | > \[e2..e3\]*  | > e1\<=e3*          |                    |
+---------+----------------+---------------------+--------------------+
| 49.c    | > *e1 in e2*   | > *e1 = e2*         | > e2 is a          |
|         |                |                     | > qualified name   |
|         |                |                     | > that does *not*  |
|         |                |                     | > evaluate to a    |
|         |                |                     | > list             |
+---------+----------------+---------------------+--------------------+
| 49.c    | > *e1 in e2*   | > *list contains(   | > e1 is a simple   |
|         |                | > e2, e1 )*         | > value that is    |
|         |                |                     | > not a list and   |
|         |                |                     | > e2 is a          |
|         |                |                     | > qualified name   |
|         |                |                     | > that evaluates   |
|         |                |                     | > to a list        |
+---------+----------------+---------------------+--------------------+
| 49.c    | > *e1 in e2*   | > *{ ? : e1, r : e2 | > e2 is a boolean  |
|         |                | > }.r*              | > expression that  |
|         |                |                     | > uses the special |
+---------+----------------+---------------------+--------------------+


Addition and subtraction are defined in Table 56 and Table 57. Note that
if input values are not of the listed types, the result is **null**.

+-------------+----------------------+---------------------------------+
| > **Grammar | > **FEEL**           | > **Input Domain and Result**   |
| > Rule**    |                      |                                 |
+=============+======================+=================================+
| > 19        | *e1 + e2*            | > *See below*                   |
+-------------+----------------------+---------------------------------+
| > 20        | > *e1 -- e2*         | > *See below*                   |
+-------------+----------------------+---------------------------------+


+---------+---------+-------------------------------------+----------+
| > **typ | > **typ | > ***e1 + e2, e1 -- e2***           | >        |
| e(e1)** | e(e2)** |                                     | **result |
|         |         |                                     | > type** |
+=========+=========+=====================================+==========+
| >       | >       | > Let **e1=(p1,s1)** and            | > number |
|  number |  number | > **e2=(p2,s2)** as defined in      |          |
|         |         | > 10.3.2.3.1. If **value(p1,s1) +/- |          |
|         |         | > value(p2,s2)** requires a scale   |          |
|         |         | > outside the range of valid        |          |
|         |         | > scales, the result is **null**.   |          |
|         |         | > Else the result is **(p,s)** such |          |
|         |         | > that                              |          |
|         |         |                                     |          |
|         |         | -   **value(p,s) = value(p1,s1) +/- |          |
|         |         |     value(p2,s2) + ε**              |          |
|         |         |                                     |          |
|         |         | -   **s ≤ max(s1,s2)**              |          |
|         |         |                                     |          |
|         |         | -   **s** is maximized subject to   |          |
|         |         |     the limitation that **p** has   |          |
|         |         |     34 digits or less               |          |
|         |         |                                     |          |
|         |         | -   **ε** is a possible rounding    |          |
|         |         |     error.                          |          |
+---------+---------+-------------------------------------+----------+
| > date  | > date  | > Addition is undefined.            | > days   |
| > and   | > and   | > Subtraction is defined as         | > and    |
| > time  | > time  | > **valuedtj^1^                     | > time   |
|         |         | > (valuedt(e1)-valuedt(e2))**,      | >        |
|         |         | > where **valuedt** is defined in   | duration |
|         |         | > 10.3.2.3.5 and **valuedtj^1^** is |          |
|         |         | > defined in                        |          |
|         |         | >                                   |          |
|         |         | > 10.3.2.3.7. In case either value  |          |
|         |         | > is of type date, it is implicitly |          |
|         |         | > converted into a date and time    |          |
|         |         | > with time of day of UTC midnight  |          |
|         |         | > (\"00:00:00\") as defined in      |          |
|         |         | > 10.3.2.3.6. Subtraction requires  |          |
|         |         | > either both values to have a      |          |
|         |         | > timezone or both not to have a    |          |
|         |         | > timezone. Subtraction is          |          |
|         |         | > undefined for the case where only |          |
|         |         | > one of the values has a timezone. |          |
+---------+---------+-------------------------------------+----------+


+---------+---------+-------------------------------------+----------+
| > time  | > time  | Addition is undefined. Subtraction  | days and |
|         |         | is defined as **valuedtd^-1^        | time     |
|         |         | (valuet(e1)-valuet(e2))** where     | duration |
|         |         | **valuet** is defined in 10.3.2.3.4 |          |
|         |         | and **valuedtd ~-1~** is defined in |          |
|         |         | 10.3.2.3.7.                         |          |
+=========+=========+=====================================+==========+
| years   | years   | **valueymd^-1^(valueymd(e1) +/-     | years    |
| and     | and     | valueymd(e2))** where **valueymd**  | and      |
| months  | months  | and **valueymd ~-1~** is defined in | months   |
| d       | d       | 10.3.2.3.8.                         | duration |
| uration | uration |                                     |          |
+---------+---------+-------------------------------------+----------+
| days    | days    | **valuedtd ^-1^(valuedtd(e1) +/-    | days and |
| and     | and     | valuedtd(e2))** where **valuedtd**  | time     |
| time    | time    | and **valuedtd^-1^** is defined in  | duration |
| d       | d       | 10.3.2.3.7.                         |          |
| uration | uration |                                     |          |
+---------+---------+-------------------------------------+----------+
| > date  | years   | date and time (date(**e1**.year     | > date   |
| > and   | and     | +/-- **e2**.years +                 | > and    |
| > time  | months  | floor((**e1**.month +/--            | > time   |
|         | d       | **e2**.months)/12),                 |          |
|         | uration |                                     |          |
|         |         | **e1**.month +/-- **e2**.months --  |          |
|         |         | floor((**e1**.month +/--            |          |
|         |         | **e2**.months)/12) \* 12,           |          |
|         |         | **e1**.day), time(**e1**)),         |          |
|         |         |                                     |          |
|         |         | where the named properties are as   |          |
|         |         | defined in **Table 65** below, and  |          |
|         |         | the date, date and time, time and   |          |
|         |         | floor functions are as defined in   |          |
|         |         | 10.3.4, **valuedt** and **valuedt   |          |
|         |         | ^-1^** is defined in 10.3.2.3.5 and |          |
|         |         | **valueymd** is defined in          |          |
|         |         | 10.3.2.3.8.                         |          |
+---------+---------+-------------------------------------+----------+
| years   | > date  | Subtraction is undefined. Addition  | > date   |
| and     | > and   | is commutative and is defined by    | > and    |
| months  | > time  | the previous rule.                  | > time   |
| d       |         |                                     |          |
| uration |         |                                     |          |
+---------+---------+-------------------------------------+----------+
| > date  | days    | **valuedt ^-1^(valuedt(e1) +/-      | > date   |
| > and   | and     | valuedtd(e2))** where **valuedt**   | > and    |
| > time  | time    | and **valuedt ^-1^** is defined in  | > time   |
|         | d       | 10.3.2.3.5 and **valuedtd** is      |          |
|         | uration | defined in 10.3.2.3.7.              |          |
+---------+---------+-------------------------------------+----------+
| days    | > date  | Subtraction is undefined. Addition  | > date   |
| and     | > and   | is commutative and is defined by    | > and    |
| time    | > time  | the previous rule.                  | > time   |
| d       |         |                                     |          |
| uration |         |                                     |          |
+---------+---------+-------------------------------------+----------+
| > time  | days    | **valuet ^-1^(valuet(e1) +/-        | > time   |
|         | and     | valuedtd(e2))** where **valuet**    |          |
|         | time    | and **valuet ^-1^** are defined in  |          |
|         | d       | 10.3.2.3.4 and **valuedtd** is      |          |
|         | uration | defined in 10.3.2.3.7.              |          |
+---------+---------+-------------------------------------+----------+
| days    | > time  | Subtraction is undefined. Addition  | > time   |
| and     |         | is commutative and is defined by    |          |
| time    |         | the previous rule.                  |          |
| d       |         |                                     |          |
| uration |         |                                     |          |
+---------+---------+-------------------------------------+----------+
| >       | >       | Subtraction is undefined. Addition  | > string |
|  string |  string | concatenates the strings. The       |          |
|         |         | result is a string containing the   |          |
|         |         | sequence of characters in e1        |          |
|         |         | followed by the sequence of         |          |
|         |         | characters in e2.                   |          |
+---------+---------+-------------------------------------+----------+
| > date  | years   | **date( e1.year +/-- e2.years +     | > date   |
|         | and     | floor((e1.month +/--                |          |
|         | months  | e2.months)/12), e1.month +/--       |          |
|         | d       | e2.months -- floor((e1.month +/--   |          |
|         | uration | e2.months)/12) \* 12, e1.day )**,   |          |
|         |         | where the named properties are as   |          |
|         |         | defined in **Table 65** below, and  |          |
|         |         | the date and floor functions are as |          |
|         |         | defined in 10.3.4.                  |          |
+---------+---------+-------------------------------------+----------+
| years   | > date  | Subtraction is undefined. Addition  | > date   |
| and     |         | is commutative and is defined by    |          |
| months  |         | the previous rule.                  |          |
| d       |         |                                     |          |
| uration |         |                                     |          |
+---------+---------+-------------------------------------+----------+
| > date  | days    | date(valuedt^-1^ (valuedt(e1) +/-   | > date   |
|         | and     | valuedtd(e2))) where valuedt and    |          |
|         | time    | valuedt^-1^ is defined in           |          |
|         | d       | 10.3.2.3.5 and valuedtd is defined  |          |
|         | uration | in 10.3.2.3.7.                      |          |
+---------+---------+-------------------------------------+----------+
| days    | > date  | Subtraction is undefined. Addition  | > date   |
| and     |         | is commutative and is defined by    |          |
| time    |         | the previous rule.                  |          |
| d       |         |                                     |          |
| uration |         |                                     |          |
+---------+---------+-------------------------------------+----------+


Multiplication and division are defined in Table 58 and Table 59. Note
that if input values are not of the listed types, the result is
**null**.

**Table 58: General semantics of multiplication and division**

+---------------+-------------------------+----------------------------+
| > **Grammar   | > **FEEL**              | > **Input Domain and       |
| > Rule**      |                         | > Result**                 |
+===============+=========================+============================+
| > 21          | *e1 \* e2*              | > *See below*              |
+---------------+-------------------------+----------------------------+
| > 22          | > *e1 / e2*             | > *See below*              |
+---------------+-------------------------+----------------------------+


+--------+--------+-------------------+--------------------+---------+
| >      | >      | ***e1 \* e2***    | ***e1 / e2***      | > *     |
| **type | **type |                   |                    | *result |
| (e1)** | (e2)** |                   |                    | >       |
|        |        |                   |                    |  type** |
+========+========+===================+====================+=========+
| >      | >      | > If              | > If               | >       |
| number | number | > **value(p1,s1)  | >                  |  number |
| >      | >      | > \*              | **value(p2,s2)=0** |         |
| > **   | > **   | > value(p2,s2)**  | > or               |         |
| e1=(p1 | e2=(p2 | > requires a      | > **value(p1,s1) / |         |
| ,s1)** | ,s2)** | > scale outside   | > value(p2,s2)**   |         |
|        |        | > the range of    | > requires a scale |         |
|        |        | > valid scales,   | > outside the      |         |
|        |        | > the result is   | > range of valid   |         |
|        |        | > **null**. Else  | > scales, the      |         |
|        |        | > the result is   | > result is        |         |
|        |        | > **(p,s)** such  | > **null**. Else   |         |
|        |        | > that            | > the result is    |         |
|        |        |                   | > **(p,s)** such   |         |
|        |        | -   **value(p,s)  | > that             |         |
|        |        |     =             |                    |         |
|        |        |                   | -   **value(p,s) = |         |
|        |        |    value(p1,s1)** |     value(p1,s1) / |         |
|        |        |                   |     value(p2,s2) + |         |
|        |        | > **\*            |     ε**            |         |
|        |        | > value(p2,s2) +  |                    |         |
|        |        | > ε**             | -   **s ≤ s1-s2**  |         |
|        |        |                   |                    |         |
|        |        | -   **s ≤ s1+s2** | -   **s** is       |         |
|        |        |                   |     maximized      |         |
|        |        | -   **s** is      |     subject to the |         |
|        |        |     maximized     |     limitation     |         |
|        |        |     subject to    |     that **p** has |         |
|        |        |     the           |     34             |         |
|        |        |     limitation    |                    |         |
|        |        |     that **p**    | > digits or less   |         |
|        |        |     has 34 digits |                    |         |
|        |        |     or less       |                    |         |
|        |        |                   |                    |         |
|        |        | -   **ε** is a    |                    |         |
|        |        |     possible      |                    |         |
|        |        |     rounding      |                    |         |
|        |        |     error         |                    |         |
+--------+--------+-------------------+--------------------+---------+
| >      | >      | > **valueymd      | > If               | > years |
|  years | number | >                 | > **value(e2)=0**, | > and   |
| > and  |        | ^-1^(valueymd(e1) | > the result is    | >       |
| >      |        | > \* value(e2))** | > **null**.        |  months |
| months |        | > where           | >                  | > d     |
| > du   |        | > **valueymd**    | > Else the result  | uration |
| ration |        | > and **valueymd  | > is **valueymd^-^ |         |
|        |        | > ~-1~** are      | > ^1^(valueymd(e1) |         |
|        |        | > defined in      | > / value(e2))**   |         |
|        |        | > 10.3.2.3.8      | > where            |         |
|        |        |                   | > **valueymd** and |         |
|        |        |                   | > **valueymd^-1^** |         |
|        |        |                   | > are defined in   |         |
|        |        |                   | > 10.3.2.3.8.      |         |
+--------+--------+-------------------+--------------------+---------+
| >      | >      | > *See above,     | > *Not allowed*    | > years |
| number |  years | > reversing e1    |                    | > and   |
|        | > and  | > and e2*         |                    | >       |
|        | >      |                   |                    |  months |
|        | months |                   |                    | > d     |
|        | > du   |                   |                    | uration |
|        | ration |                   |                    |         |
+--------+--------+-------------------+--------------------+---------+
| >      | >      | > *Not allowed*   | > If               | >       |
|  years |  years |                   | > *                |  number |
| > and  | > and  |                   | *valueymd(e2)=0**, |         |
| >      | >      |                   | > the result is    |         |
| months | months |                   | > **null**. Else   |         |
| > du   | > du   |                   | > the result is    |         |
| ration | ration |                   | > **valueymd(e1) / |         |
|        |        |                   | > valueymd(e2)**   |         |
|        |        |                   | > where            |         |
|        |        |                   | > **valueymd** is  |         |
|        |        |                   | > defined in       |         |
|        |        |                   | > 10.3.2.3.8.      |         |
+--------+--------+-------------------+--------------------+---------+
| days   | >      | > **valuedtd      | > If               | days    |
| and    | number | ^-1^(valuedtd(e1) | > **value(e2)=0**, | and     |
| time   |        | > \* value(e2))** | > the result is    | time    |
| du     |        | > where           | > **null**.        | d       |
| ration |        | > **valuedtd**    | >                  | uration |
|        |        | > and **valuedtd  | > Else the result  |         |
|        |        | > ~-1~** are      | > is **valuedtd    |         |
|        |        | > defined in      | > ^1^(valuedtd(e1) |         |
|        |        | > 10.3.2.3.7.     | > \* value(e2))**  |         |
|        |        |                   | > where            |         |
|        |        |                   | > **valuedtd** and |         |
|        |        |                   | > **valuedtd       |         |
|        |        |                   | > ~-1~** are       |         |
|        |        |                   | > defined in       |         |
|        |        |                   | > 10.3.2.3.7.      |         |
+--------+--------+-------------------+--------------------+---------+
| >      | > days | > *See above,     | > *Not allowed*    | days    |
| number | > and  | > reversing e1    |                    | and     |
|        | > time | > and e2*         |                    | time    |
|        | > du   |                   |                    | d       |
|        | ration |                   |                    | uration |
+--------+--------+-------------------+--------------------+---------+
| days   | > days | > *Not allowed*   | > If               | >       |
| and    | > and  |                   | > *                |  number |
| time   | > time |                   | *valuedtd(e2)=0**, |         |
| du     | > du   |                   | > the result is    |         |
| ration | ration |                   | > **null**. Else   |         |
|        |        |                   | > the result is    |         |
|        |        |                   | > **valuedtd(e1) / |         |
|        |        |                   | > valuedtd(e2)**   |         |
|        |        |                   | > where            |         |
|        |        |                   | > **~valuedtd~**   |         |
|        |        |                   | > is defined in    |         |
|        |        |                   | >                  |         |
|        |        |                   | > 10.3.2.3.7.      |         |
+--------+--------+-------------------+--------------------+---------+


+--------+-------+-----------------------+----------------------------+
| **Gra  | **F   | > **Input Domain**    | > **Result**               |
| mmar** | EEL** |                       |                            |
|        |       |                       |                            |
| **     | **Syn |                       |                            |
| Rule** | tax** |                       |                            |
+========+=======+=======================+============================+
| > 23   | > *e1 | **type(e1)** is       | If **value(e1)value(e2 )** |
|        | >     | number. **value(e2)** | requires a scale that is   |
|        |  \*\* | is a number in the    | out of range, the result   |
|        | > e2* | range                 | is **null**. Else the      |
|        |       |                       | result is **(p,s)** such   |
|        |       | \[-999,99             | that                       |
|        |       | 9,999..999,999,999\]. |                            |
|        |       |                       | -   **value(p,s)=          |
|        |       |                       |                            |
|        |       |                       | value(e1)^value(e^~2~^)^ + |
|        |       |                       |     ε**                    |
|        |       |                       |                            |
|        |       |                       | -   **p** is limited to 34 |
|        |       |                       |     digits                 |
|        |       |                       |                            |
|        |       |                       | -   **ε** is rounding      |
|        |       |                       |     error                  |
+--------+-------+-----------------------+----------------------------+


Type-checking is defined in Table 61. Note that *type* is not mapped to
the domain, and **null** is the only value in the Null type (see
10.3.2.1).

Before evaluating the *instance of* operator both operands are mapped to
the type lattice **L** (see 10.3.2.9).

**Table 61: Semantics of type-checking**

+-------+------------+--------------------+----------------------------+
| *     | > **FEEL   | > **Mapped to      | > **Examples**             |
| *Gram | > Syntax** | > Domain**         |                            |
| mar** |            |                    |                            |
|       |            |                    |                            |
| **R   |            |                    |                            |
| ule** |            |                    |                            |
+=======+============+====================+============================+
| > 51  | > *e1      | > **If *e~2~*      | > *\[123\] instance of     |
|       | > instance | > cannot be mapped | > list\<number\>* is       |
|       | > of e2*   | > to a node in the | > **true**                 |
|       |            | > lattice L, the   | >                          |
|       |            | > result is        | > *\"abc\" instance of     |
|       |            | > null.**          | > string* is **true**      |
|       |            | >                  | >                          |
|       |            | > If **e~1~** is   | > *123 instance of string* |
|       |            | > **null** and     | > is **false**             |
|       |            | > **               | >                          |
|       |            | type(***e~2~***)** | > *123 instance of list*   |
|       |            | > is *Null*, the   | > is **null** as a list    |
|       |            | > result is        | > type requires parameters |
|       |            | > **true**.        | > (see rule 54).           |
|       |            | >                  |                            |
|       |            | > If               |                            |
|       |            | > **               |                            |
|       |            | type(***e~1~***)** |                            |
|       |            | > conforms to      |                            |
|       |            | > **               |                            |
|       |            | type(***e~2~***)** |                            |
|       |            | > (see section     |                            |
|       |            | > 10.3.2.9) and    |                            |
|       |            | > **e~1~** is not  |                            |
|       |            | > **null,** the    |                            |
|       |            | > result is        |                            |
|       |            | > **true**.        |                            |
|       |            | >                  |                            |
|       |            | > Otherwise the    |                            |
|       |            | > result is        |                            |
|       |            | > **false**.       |                            |
+-------+------------+--------------------+----------------------------+


Negative numbers and negation of durations are defined in Table 62.

+---------------+-------------------------+----------------------------+
| > **Grammar   | **FEEL Syntax**         | > **Equivalent FEEL        |
| > Rule**      |                         | > Syntax**                 |
+===============+=========================+============================+
| > 24          | *-e*                    | > *e\*-1*                  |
+---------------+-------------------------+----------------------------+


Invocation is defined in Table 63. An invocation can use positional
arguments or named arguments. If positional, all arguments must be
supplied. If named, unsupplied arguments are bound to **null**. Note
that **e** can be a user-defined function, a user-defined external
function, or a built-in function. The arguments are subject to implicit
conversions (10.3.2.9.4). If the argument types before or after
conversion do not conform to the corresponding parameter types, the
result of the invocation is **null**.

+----------+-----------------+-------------------+-------------------+
| > *      | > **FEEL**      | > **Mapped to     | >                 |
| *Grammar |                 | > Domain**        | **Applicability** |
| > Rule** |                 |                   |                   |
+==========+=================+===================+===================+
| > 38,    | > *e(e1,..)*    | > *               | **e** is a        |
| > 39, 42 |                 | *e(e1**,\...**)** | function with     |
|          |                 |                   | matching arity    |
|          |                 |                   | and conforming    |
|          |                 |                   | parameter types   |
+----------+-----------------+-------------------+-------------------+
| > 38,    | >               | > **e(**          | **e** is a        |
| > 39,    | *e(n1:e1,\...)* | *n1***:e1,\...)** | function with     |
| > 40, 41 |                 |                   | matching          |
|          |                 |                   | parameter names   |
|          |                 |                   | and conforming    |
|          |                 |                   | parameter types   |
+----------+-----------------+-------------------+-------------------+


Properties are defined in Table 64 and Table 65. If **type(***e***)** is
date and time, time, or duration, and **name** is a property name, then
the meaning is given by Table 65 and Table 66. For example, FEEL(*date
and time(\"2012-0307Z\").year*) = **2012**.

**Table 64: General semantics of properties**

+---------+-------------+-------------+--------------+----------------+
| > **    | > **FEEL**  |             | > **Mapped   | **A            |
| Grammar |             |             | > to         | pplicability** |
| >       |             |             | > Domain**   |                |
|  Rule** |             |             |              |                |
+=========+=============+=============+==============+================+
| > 18    | > *e.name*  |             | > **         | **type(e)** is |
|         |             |             | e.\"name\"** | a context      |
+---------+-------------+-------------+--------------+----------------+
| > 18    | > *e.name*  |             | > *see       | **type(e)** is |
|         |             |             | > below*     | a              |
|         |             |             |              | date           |
|         |             |             |              | /time/duration |
+---------+-------------+-------------+--------------+----------------+


**Table 65: List of properties per type**

+--------------+---------------------------------+---------------------+
| > *          | > ***e .* name**                | > **name =**        |
| *type(*e*)** |                                 |                     |
+==============+=================================+=====================+
| > date       | result is the **name**d         | > year, month, day, |
|              | component of the date object    | > weekday           |
|              | **e**. Valid names are shown to |                     |
|              | the right.                      |                     |
+--------------+---------------------------------+---------------------+
| > date and   | result is the **name**d         | year, month, day,   |
| > time       | component of the date and time  | weekday, hour,      |
|              | object **e**. Valid names are   | minute, second,     |
|              | shown to the right.             | time offset,        |
|              |                                 | timezone            |
+--------------+---------------------------------+---------------------+
| > time       | result is the **name**d         | hour, minute,       |
|              | component of the time object    | second, time        |
|              | **e**.                          | offset, timezone    |
|              |                                 |                     |
|              | Valid names are shown to the    |                     |
|              | right                           |                     |
+--------------+---------------------------------+---------------------+
| years and    | result is the **name**d         | > years, months     |
| months       | component of the years and      |                     |
| duration     | months duration object **e**.   |                     |
|              | Valid names are shown to the    |                     |
|              | right.                          |                     |
+--------------+---------------------------------+---------------------+
| days and     | result is the **name**d         | > days, hours,      |
| time         | component of the days and time  | > minutes, seconds  |
| duration     | duration object **e**. Valid    |                     |
|              | names are shown to the right.   |                     |
+--------------+---------------------------------+---------------------+
| > range      | result is the **name**d         | start, end, start   |
|              | component of the range object   | included, end       |
|              | **e**. Valid names are shown to | included            |
|              | the right.                      |                     |
+--------------+---------------------------------+---------------------+


+-------------+-------------+-----------------------------------------+
| > **name**  | > ***ty     | > **description**                       |
|             | pe*(name)** |                                         |
+=============+=============+=========================================+
| > year      | > number    | The year number as an integer in the    |
|             |             | interval \[-999,999,999 ..              |
|             |             |                                         |
|             |             | 999,999,999\]                           |
+-------------+-------------+-----------------------------------------+
| > month     | > number    | The month number as an integer in the   |
|             |             | interval \[1..12\], where 1 is          |
|             |             |                                         |
|             |             | January and 12 is December              |
+-------------+-------------+-----------------------------------------+
| > day       | > number    | > The day of the month as an integer in |
|             |             | > the interval \[1..31\]                |
+-------------+-------------+-----------------------------------------+
| > weekday   | > number    | The day of the week as an integer in    |
|             |             | the interval \[1. .7\] where 1 is       |
|             |             |                                         |
|             |             | Monday and 7 is Sunday (compliant with  |
|             |             | the definition in ISO 8601)             |
+-------------+-------------+-----------------------------------------+
| > hour      | > number    | > The hour of the day as an integer in  |
|             |             | > the interval \[0..23\]                |
+-------------+-------------+-----------------------------------------+
| > minute    | > number    | > The minute of the hour as an integer  |
|             |             | > in the interval \[0..59\]             |
+-------------+-------------+-----------------------------------------+
| > second    | > number    | > The second of the minute as a decimal |
|             |             | > in the interval \[0. .60)             |
+-------------+-------------+-----------------------------------------+
| > time      | > days and  | The duration offset corresponding to    |
| > offset    | > time      | the timezone the date or date and time  |
|             | > duration  | value represents. The time offset       |
|             |             | duration must be in the interval        |
|             |             | **\[du                                  |
|             |             | ration("-PT14H")..duration("PT14H")\]** |
|             |             | as per the XML Schema Part 2 dateTime   |
|             |             | datatype. The **time offset** property  |
|             |             | returns null when the object does not   |
|             |             | have a time offset set.                 |
+-------------+-------------+-----------------------------------------+
| > timezone  | > string    | The timezone identifier as defined in   |
|             |             | the IANA Time Zones database. The       |
|             |             | **timezone** property returns null when |
|             |             | the object does not have an IANA        |
|             |             | timezone defined.                       |
+-------------+-------------+-----------------------------------------+
| > name      | >           | description                             |
|             |  type(name) |                                         |
+-------------+-------------+-----------------------------------------+
| > years     | > number    | The normalized years component of a     |
|             |             | years and months duration value as an   |
|             |             | integer. This property returns null     |
|             |             | when invoked on a days and time         |
|             |             | duration value.                         |
+-------------+-------------+-----------------------------------------+
| > months    | > number    | The normalized months component of a    |
|             |             | years and months duration value. Since  |
|             |             | the value is normalized, this property  |
|             |             | must return an integer in the interval  |
|             |             | \[0.. 11\]. This property returns null  |
|             |             | when invoked on a days and time         |
|             |             | duration value.                         |
+-------------+-------------+-----------------------------------------+
| > days      | > number    | The normalized days component of a days |
|             |             | and time duration value as an integer.  |
|             |             | This property returns null when invoked |
|             |             | on a years and months duration value.   |
+-------------+-------------+-----------------------------------------+
| > hours     | > number    | The normalized hours component of a     |
|             |             | days and time duration value. Since the |
|             |             | value is normalized, this property must |
|             |             | return an integer in the interval       |
|             |             | \[0..23\]. This property returns null   |
|             |             | when invoked on a years and months      |
|             |             | duration value.                         |
+-------------+-------------+-----------------------------------------+
| > minutes   | > number    | The normalized minutes component of a   |
|             |             | days and time duration value. Since the |
|             |             | value is normalized, this property must |
|             |             | return an integer in the interval       |
|             |             | \[0..59\]. This property returns null   |
|             |             | when invoked on a years and months      |
|             |             | duration value.                         |
+-------------+-------------+-----------------------------------------+
| > seconds   | > number    | The normalized minutes component of a   |
|             |             | days and time duration value. Since the |
|             |             | value is normalized, this property must |
|             |             | return a decimal in the interval        |
|             |             | \[0..60). This property returns null    |
|             |             | when invoked on a years and months      |
|             |             | duration value.                         |
+-------------+-------------+-----------------------------------------+


+----------------------+----------------------+-----------------------+
| > **name**           | > **type(name)**     | > **description**     |
+======================+======================+=======================+
| > start              | > Type of the start  | > the start endpoint  |
|                      | > endpoint of the    | > of the range        |
|                      | > range              |                       |
+----------------------+----------------------+-----------------------+
| > end                | > Type of the end    | > the end endpoint of |
|                      | > endpoint of the    | > the range           |
|                      | > range              |                       |
+----------------------+----------------------+-----------------------+
| > start included     | > boolean            | true if the start     |
|                      |                      | endpoint is included  |
|                      |                      | in the range          |
+----------------------+----------------------+-----------------------+
| > end included       | > boolean            | true if the end       |
|                      |                      | endpoint is included  |
|                      |                      | in the range          |
+----------------------+----------------------+-----------------------+


Lists are defined in Table 68.

+---------+-------+------------------------+-------------------------+
| **Gr    | **F   | > **Mapped to Domain   | > **Applicability**     |
| ammar** | EEL** | > (scope s)**          |                         |
|         |       |                        |                         |
| *       | **Syn |                        |                         |
| *Rule** | tax** |                        |                         |
+=========+=======+========================+=========================+
| > 54    | >     | > **e1\[e2\]**         | **e1** is a list and    |
|         | *e1\[ |                        | **e2** is an integer (0 |
|         | e2\]* |                        | scale number)           |
+---------+-------+------------------------+-------------------------+
| > 54    | >     | > **e 1**              | **e1** is not a list    |
|         | *e1\[ |                        | and not **null** and    |
|         | e2\]* |                        | **value(e2)**           |
|         |       |                        |                         |
|         |       |                        | = **1**                 |
+---------+-------+------------------------+-------------------------+
| > 54    | >     | > list of items **e**  | **e1** is a list and    |
|         | *e1\[ | > such that **i** is   | **type(**FEEL(*e2,*     |
|         | e2\]* | > in **e** iff **i**   | **s\'**)**)** is        |
|         |       | > is in **e1** and     | boolean                 |
|         |       | > FEEL(*e2,* **s\'**)  |                         |
|         |       | > is **true**, where   |                         |
|         |       | > **s\'** is the scope |                         |
|         |       | > **s** with a special |                         |
|         |       | > first context        |                         |
|         |       | > containing the       |                         |
|         |       | > context entry        |                         |
|         |       | > (\"**item**\",       |                         |
|         |       | > **i**) and if **i**  |                         |
|         |       | > is a context, the    |                         |
|         |       | > special context also |                         |
|         |       | > contains all the     |                         |
|         |       | > context entries of   |                         |
|         |       | > **i**.               |                         |
+---------+-------+------------------------+-------------------------+
| > 54    | >     | > **\[e1\]** if        | **e1** is not a list    |
|         | *e1\[ | > FEEL(*e2,* **s\'**)  | and not **null** and    |
|         | e2\]* | > is **true**, where   | **type(**FEEL(*e2,*     |
|         |       | > **s\'** is the scope | **s\'**)**)** is        |
|         |       | > **s** with a special | boolean                 |
|         |       | > first context        |                         |
|         |       | > containing the       |                         |
|         |       | > context entry        |                         |
|         |       | > (\"**item**\",       |                         |
|         |       | > **e1**) and if       |                         |
|         |       | > **e1** is a context, |                         |
|         |       | > the special context  |                         |
|         |       | > also contains all    |                         |
|         |       | > the context entries  |                         |
|         |       | > of **e1**.           |                         |
|         |       | >                      |                         |
|         |       | > Else **\[\]**.       |                         |
+---------+-------+------------------------+-------------------------+


Contexts are defined in Table 69.

**Table 69: Semantics of contexts**

+-----------+--------------------+-------------------------------------+
| >         | > **FEEL Syntax**  | > **Mapped to Domain (scope s)**    |
| **Grammar |                    |                                     |
| > Rule**  |                    |                                     |
+===========+====================+=====================================+
|           | > *{ n1 : e1, n2 : | > **{** \"**n1**\"**:** FEEL(*e1*,  |
|           | > e2, \...}*       | > **s1**)**,** \"**n2**\"**:**      |
|           |                    | > FEEL(*e2*, **s2**)**, \...}**     |
|           |                    | > such that the **si** are all      |
|           |                    | > **s** with a special first        |
|           |                    | > context **ci** containing a       |
+-----------+--------------------+-------------------------------------+
|           | > *{ \"n1\" : e1,  |                                     |
|           | > \"n2\" : e2,     |                                     |
|           | > \...}*           |                                     |
+-----------+--------------------+-------------------------------------+
| > 57      |                    | > subset of the entries of this     |
|           |                    | > result context. If **ci**         |
|           |                    | > contains the entry for **nj**,    |
|           |                    | > then **cj** does not contain the  |
|           |                    | > entry for **ni**.                 |
+-----------+--------------------+-------------------------------------+
| > 54      | > *\[e1, e2,       | > **\[** FEEL(*e1*)**,**            |
|           | > \...\]*          | > FEEL(*e2*)**, \...\]**            |
+-----------+--------------------+-------------------------------------+


#### Error Handling

When a built-in function encounters input that is outside its defined
domain, the function SHOULD report or log diagnostic information if
appropriate and SHALL return **null**.

### XML Data

FEEL supports XML Data in the FEEL context by mapping XML Data into the
FEEL Semantic Domain. Let XE(*e*, **p**) be a function mapping an XML
element *e* and a parent FEEL context **p** to a FEEL context , as
defined in the following tables. XE makes use of another mapping
function, XV(*v*), that maps an XML value *v* to the FEEL semantic
domain.

XML namespace semantics are not supported by the mappings. For example,
given the namespace prefix declarations *xmlns:p1=
\"[[http://example.org/foobar]{.underline}\"](http://example.org/foobar)*
and *xmlns:p2= \"[[http://example.
org/foobar]{.underline}\"](http://example.org/foobar)*, the tags
*p1:myElement* and *p2:myElement* are the same element using XML
namespace semantics but are different using XML without namespace
semantics.

#### Semantic mapping for XML elements (XE)

Table 70, *e* is the name of an XML element, *a* is the name of one of
its attributes, *c* is a child element, and *v* is a value. The parent
context **p** is initially empty.

+------------------------+-----------------------+---------------------+
| > **XML**              | > **context entry in  | > **Remark**        |
|                        | > p**                 |                     |
+========================+=======================+=====================+
| > *\<e /\>*            | > \"**e**\" **:       | empty element →     |
|                        | > null**              | **null**-valued     |
|                        |                       | entry in **p**      |
+------------------------+-----------------------+---------------------+
| > *\<q:e /\>*          | > \"**e**\" **:       | > namespaces are    |
|                        | > null**              | > ignored.          |
+------------------------+-----------------------+---------------------+
| > *\<e\>v\</e\>*       | >                     | unrepeated element  |
|                        | \"**e**\"**:**XV(*v*) | without attributes  |
+------------------------+-----------------------+---------------------+
| > *\<e\>v1\</e\>       | > \"**e**\"**: \[**   | repeating element   |
| > \<e\>v2\</e\>*       | > XV(*v1*)**,**       | without attributes  |
|                        | > XV(*v2*) **\]**     |                     |
+------------------------+-----------------------+---------------------+
| > *\<e a=\"v\"/\>*     | > **\"e\": { \"a\":** | An element          |
| >                      | > XV(*v*),            | containing          |
| > *\<c1\>v1\</c1\>*    | >                     | attributes or child |
|                        | > **\"c1\":**         | elements → context  |
|                        | > XV(*v1*),           |                     |
+------------------------+-----------------------+---------------------+
| > *\<e                 | \"**e**\"**: {**      | *v2* is contained   |
| > a=\"v1\"\>v2\</e\>*  | \"**\@a**\"**:**      | in a generated      |
|                        | XV(*v1*),             |                     |
|                        | \                     | \$content entry     |
|                        | "**\$content**\"**:** |                     |
|                        |                       |                     |
|                        | XV(*v2*) **}**        |                     |
+------------------------+-----------------------+---------------------+


An entry in the **context entry in p** column such as **\"e\" : null**
indicates a context entry with string key **\"e\"** and value **null**.
The context entries are contained by context **p** that corresponds to
the containing XML element, or to the XML document itself.

The mapping does not replace namespace prefixes with the namespace IRIs.
FEEL requires only that keys within a context be distinct, and the
namespace prefixes are sufficient.

#### Semantic mapping for XML values (XV)

If an XML document was parsed with a schema, then some atomic values may
have a datatype other than string. Table 71defines how a typed XML value
*v* is mapped to FEEL.

+-----------------------------+----------------------------------------+
| **Type of *v***             | > **FEEL Semantic Domain**             |
+=============================+========================================+
| number                      | > FEEL(*v*)                            |
+-----------------------------+----------------------------------------+
| string                      | > FEEL(*\"v\"*)                        |
+-----------------------------+----------------------------------------+
| date                        | > FEEL(*date(\"v\")*)                  |
+-----------------------------+----------------------------------------+
| dateTime                    | > FEEL(*date and time(\"v\")*)         |
+-----------------------------+----------------------------------------+
| time                        | > FEEL(*time(\"v\")*)                  |
+-----------------------------+----------------------------------------+
| duration                    | > FEEL(duration(\"v\"))                |
+-----------------------------+----------------------------------------+
| list, e.g. \"v1 v2\"        | > \[ XV(v1), XV(v2) \]                 |
+-----------------------------+----------------------------------------+
| element                     | > XE(v)                                |
+-----------------------------+----------------------------------------+


#### XML example

The following schema and instance are equivalent to the following FEEL:

##### ~schema~

> \<xsd:schema
> xmlns:xsd=\"[[http://www.w3.org/2001/XMLSchema]{.underline}\"](http://www.w3.org/2001/XMLSchema)
> xmlns=\"[[http://www.example.org]{.underline}\"](http://www.example.org/)
> ta rgetNa mespace=[\"
> [http://www.example.org]{.underline}\"](http://www.example.org/)
> elementFormDefault=\"qualified\"\>
>
> \<xsd:element name=\"Context\"\>
>
> \<xsd :complexType\> \<xsd:sequence\>
>
> \<xsd:element name=\"Employee\"\>
>
> \<xsd:complexType\> \<xsd:sequence\>
>
> \<xsd :element na me=\"sala ry\" type=\"xsd :deci ma l\"/\>
>
> \</xsd :seq uence\> \</xsd :complexType\>
>
> \</xsd:element\>
>
> \<xsd:element name=\"Customer\" maxOccurs=\"unbounded\"\>
>
> \<xsd:complexType\> \<xsd:sequence\>
>
> \<xsd :element na me=\"loya lty_level\" type=\"xsd :stri ng\"/\>
>
> \<xsd :element na me=\"credit_li mit\" type=\"xsd :decima l\"/\>
>
> \</xsd :seq uence\>
>
> \</xsd :complexType\>
>
> \</xsd:element\>
>
> \</xsd:sequence\> \</xsd :complexType\>
>
> \</xsd:element\>

\</xsd:schema\>

##### instance

> \<Context
> xmlns:tns=\"[[http://www.example.org]{.underline}\"](http://www.example.org/)
> xmlns=\"[[http://www.example.org]{.underline}\"](http://www.example.org/)\>
>
> \<tns:Employee\>
>
> \<tns:salary\>13000\</tns:salary\>
>
> \</tns:Employee\>
>
> \<Customer\>
>
> \<loyalty_level\>gold\</loyalty_level\>
>
> \<credit_limit\>10000\</credit_limit\>
>
> \</Customer\>
>
> \<Customer\>
>
> \<loyalty_level\>gold\</loyalty_level\>
>
> \<credit_limit\>20000\</credit_limit\>
>
> \</Customer\> \<Customer\> \<loya
>
> lty_level\>si lver\</loya lty_level\>
>
> \<credit_limit\>5000\</credit_limit\>
>
> \</Customer\>
>
> \</Context\>

##### equivalent FEEL boxed context

+-------------------------+----------------------+--------------------+
| > **Context**           |                      |                    |
+=========================+======================+====================+
| > Employee              | > salary             | > 13000            |
+-------------------------+----------------------+--------------------+
| > Customer              | > loyalty_level      | > credit_limit     |
+-------------------------+----------------------+--------------------+
|                         | > *gold*             | 10000              |
+-------------------------+----------------------+--------------------+
|                         | > *gold*             | 20000              |
+-------------------------+----------------------+--------------------+
|                         | > *silver*           | 5000               |
+-------------------------+----------------------+--------------------+

When a decision model is evaluated, its input data described by an item
definition such as an XML Schema element

(clause 7.3.2) is bound to case data mapped to the FEEL domain. The case
data can be in various formats, such as XML. We can notate case data as
an equivalent boxed context, as above. Decision logic can reference
entries in the context using expressions such as
*Context.tns\$Employee.tns\$salary*, which has a value of 13000.

### Built-in functions

To promote interoperability, FEEL includes a library of built-in
functions. The syntax and semantics of the built-ins are required for a
conformant FEEL implementation.

In all of the tables in this section, a superscript refers to an
additional domain constraint stated in the corresponding footnote to the
table. Whenever a parameter is outside its domain, the result of the
built-in is **null**.

#### Conversion functions

FEEL supports many conversions between values of different types. Of
particular importance is the conversion from strings to dates, times,
and durations. There is no literal representation for date, time, or
duration. Also, formatted numbers such as *1,000.00* must be converted
from a string by specifying the grouping separator and the decimal
separator.

Built-ins are summarized in Table 72. The first column shows the name
and parameters. A question mark (*?*) denotes an optional parameter. The
second column specifies the domain for the parameters. The parameter
domain is specified as one of:

-   a type, *e.g.,* number, string

-   any -- any element from the semantic domain, including **null**

-   not null -- any element from the semantic domain, excluding **null**

-   date string -- a string value in the lexical space of the date
    > datatype specified by XML Schema Part 2 Datatypes

-   time string -- either

> a string value in the lexical space of the time datatype specified by
> XML Schema Part 2 Datatypes; or a string value that is the extended
> form of a local time representation as specified by ISO 8601, followed
> by the character \"@\", followed by a string value that is a time zone
> identifier in the IANA Time Zones Database
> [([http://www.iana.org/time-zones)]{.underline}](http://www.iana.org/time-zones))

-   date time string -- a string value consisting of a date string
    > value, as specified above, optionally followed by the character
    > \"T\" followed by a time string value as specified above.

-   duration string -- a string value in the lexical space of the
    > xs:dayTimeDuration or xs:yearMonthDuration datatypes specified by
    > the XQuery 1.0 and XPath 2.0 Data Model.

-   range string -- a string value conforming to grammar rule 66 "range
    > literal\" as defined in chapter 10.3.1.2.

+---------------+--------------+------------+-------------------------+
| > **Name(     | *            | > **Des    | > **Example**           |
| parameters)** | *Parameter** | cription** |                         |
|               |              |            |                         |
|               | **Domain**   |            |                         |
+===============+==============+============+=========================+
| >             | > date       | > convert  | *date(\"2012-12-25\")   |
|  date(*from*) | > string     | > *from*   | -- date(\"2012-12-24\") |
|               |              | > to a     | = duration(\"P1D \")*   |
|               |              | > date     |                         |
+---------------+--------------+------------+-------------------------+
| >             | > date and   | convert    | *date( date and         |
|  date(*from*) | > time       | *from* to  | time(\"2                |
|               |              | a date     | 012-12-25T11:00:00Z\")) |
|               |              | (set time  | =*                      |
|               |              | components |                         |
|               |              | to null)   | *date(\"2012-12-25\")*  |
+---------------+--------------+------------+-------------------------+
| >             | *year*,      | creates a  | > *date (2012, 12, 25)  |
|  date(*year*, | *month*,     | date from  | > =                     |
| > *month*,    | *day* are    | year,      | > date(\"2012-12-25\")* |
| > *day*)      | numbers      | month, day |                         |
|               |              | component  |                         |
|               |              | values     |                         |
+---------------+--------------+------------+-------------------------+
| > date and    | *date* is a  | creates a  | *date and time          |
| >             | date or date | date time  | (\                      |
|  time(*date*, | time; *time* | from the   | "2012-12-24T23:59:00\") |
| > *time*)     | is a time    | given date | = date and time         |
|               |              | (ignoring  | (date(\"2012-12-24"),   |
|               |              | any time   | time ("23:59:00\"))*    |
|               |              | component) |                         |
|               |              | and the    |                         |
|               |              | given time |                         |
+---------------+--------------+------------+-------------------------+
| > date and    | > date time  | convert    | *date and               |
| >             | > string     | *from* to  | time(\"2                |
|  time(*from*) |              | a date and | 012-12-24T23:59:00\") + |
|               |              | time       | duration(\"PT1M\") =    |
|               |              |            | date and time(\"2012-*  |
|               |              |            |                         |
|               |              |            | *12-25T00:00:00\")*     |
+---------------+--------------+------------+-------------------------+
| >             | > time       | > convert  | *time(\"23:59:00z\") +  |
|  time(*from*) | > string     | > *from*   | duration(\"PT2M\") =    |
|               |              | > to time  | time                    |
|               |              |            | (\"00:01:00@Etc/UTC\")* |
+---------------+--------------+------------+-------------------------+
| >             | > time, date | convert    | *time( date and         |
|  time(*from*) | > and time   | *from* to  | time(\"2                |
|               |              | time       | 012-12-25T11:00:00Z\")) |
|               |              | (ignoring  | = time(\"1 1:00:00Z\")* |
|               |              | date       |                         |
|               |              | c          |                         |
|               |              | omponents) |                         |
+---------------+--------------+------------+-------------------------+
| time(*hour*,  | *hour*,      | creates a  | > *time ("23:59:00z\")  |
| *minute*,     | *minute*,    | time from  | > =*                    |
| *second*,     | *second*,    | the given  | >                       |
| *offset?*)    | are numbers, | component  | > *time (23, 59, 0,     |
|               | *offset* is  | values     | > duration("PT0H"))*    |
|               | a days and   |            |                         |
|               | time         |            |                         |
|               | duration,    |            |                         |
|               |              |            |                         |
|               | or null      |            |                         |
+---------------+--------------+------------+-------------------------+
| number(*from, | string^1^,   | > convert  | > *number(\"1 000,0\",  |
| grouping      | string,      | > *from*   | > \" \", \",\") =       |
| separator,    | string       | > to a     | > number(\"1,000.0\",   |
| decimal       |              | > number   | > \" ,\", \".\")*       |
| separator*)   |              |            |                         |
+---------------+--------------+------------+-------------------------+
| string(from)  | non-null     | > convert  | > *string(1.1) =        |
|               |              | > from to  | > \"1.1\" string(null)  |
|               |              | > a string | > = null*               |
+---------------+--------------+------------+-------------------------+
| d             | duration     | > convert  | > *date and             |
| uration(from) | string       | > from to  | > time(\"2              |
|               |              | > a days   | 012-12-24T23:59:00\") - |
|               |              | > and time | > date and              |
|               |              | > or years | > time(\                |
|               |              | > and      | "2012-12-22T03:45:00\") |
|               |              | > months   | > =                     |
|               |              | > duration | > d                     |
|               |              |            | uration(\"P2DT20H14M\") |
|               |              |            | > duration(\"P2Y2M\") = |
|               |              |            | > duration(\"P26M\")*   |
+---------------+--------------+------------+-------------------------+
| years and     | both are     | > return   | > *years and months     |
| months        | date or both | > years    | > duration              |
| d             | are date and | > and      | >                       |
| uration(from, | time         | > months   |  (date(\"2011-12-22\"), |
| to)           |              | > duration | > date(\"2013-08-24\")  |
|               |              | > between  | > ) =                   |
|               |              | > from and | > duration(\"P1Y8M\")*  |
|               |              | > to       |                         |
+---------------+--------------+------------+-------------------------+

+---------------+--------------+------------+-------------------------+
| > range       | > range      | > Convert  | >                       |
| > (*from*)    | > string     | > from a   |  *range(\"\[18..21)\")* |
|               |              | > range    | > is *\[18..21)*        |
|               |              | > string   | >                       |
|               |              | > to a     | > *range(\"\[2..)\")*   |
|               |              | > range,   | > is *\>=2*             |
|               |              | >          | >                       |
|               |              |  according | > *range(\"(..2)\")* is |
|               |              | > to the   | > *\<2*                 |
|               |              | > d        | >                       |
|               |              | efinitions | > *range(\"\") is*      |
|               |              | > of       | > **null**              |
|               |              | > chapter  | >                       |
|               |              | > 10.3.2.7 | > *range(\"\[..\]\")    |
|               |              | >          | > is* **null**          |
|               |              |  "Ranges". |                         |
|               |              | >          |                         |
|               |              | > Please   |                         |
|               |              | > notice   |                         |
|               |              | > that in  |                         |
|               |              | > range    |                         |
|               |              | > string,  |                         |
|               |              | > only     |                         |
|               |              | > literal  |                         |
|               |              | > range    |                         |
|               |              | >          |                         |
|               |              |  endpoints |                         |
|               |              | > are      |                         |
|               |              | > allowed  |                         |
|               |              | > as       |                         |
|               |              | > defined  |                         |
|               |              | > in       |                         |
|               |              | > grammar  |                         |
|               |              | > rule 67  |                         |
|               |              | > "range   |                         |
|               |              | >          |                         |
|               |              | endpoint\" |                         |
|               |              | > in       |                         |
|               |              | > chapter  |                         |
|               |              | >          |                         |
|               |              |  10.3.1.2. |                         |
|               |              | >          |                         |
|               |              | > If range |                         |
|               |              | > string   |                         |
|               |              | > does not |                         |
|               |              | > conform  |                         |
|               |              | > with     |                         |
|               |              | > grammar  |                         |
|               |              | > rule 66, |                         |
|               |              | > the      |                         |
|               |              | > result   |                         |
|               |              | > is       |                         |
|               |              | >          |                         |
|               |              |  **null**. |                         |
+===============+==============+============+=========================+
+---------------+--------------+------------+-------------------------+

> 1\. *grouping* SHALL be one of space (\' \'), comma (\',\'), period
> (\'.\'), or null.
>
> *decimal* SHALL be one of period, comma, or null, but SHALL NOT be the
> same as the grouping separator unless both are null.
>
> *from* SHALL conform to grammar rule 37, after removing all
> occurrences of the grouping separator, if any, and after changing the
> decimal separator, if present, to a period.

#### Boolean function

Table 73 defines Boolean functions.

**Table 73: Semantics of Boolean functions**

+---------------+-----------+--------------+-------------------------+
| > **Name(     | **Pa      | > **D        | > **Example**           |
| parameters)** | rameter** | escription** |                         |
|               |           |              |                         |
|               | *         |              |                         |
|               | *Domain** |              |                         |
+===============+===========+==============+=========================+
| >             | > boolean | > logical    | *not(true) = false      |
| not(*negand*) |           | > negation   | not(null) = null*       |
+---------------+-----------+--------------+-------------------------+

#### String functions

Table 74 defines string functions.

+-------------+-----------+--------------+----------------------------+
| > **Name(pa | **Pa      | > **D        | > **Example**              |
| rameters)** | rameter** | escription** |                            |
|             |           |              |                            |
|             | *         |              |                            |
|             | *Domain** |              |                            |
+=============+===========+==============+============================+
| substri     | > string, | return       | *substring(\"foobar\",3) = |
| ng(*string, | >         | *length* (or | \"obar\"                   |
| start       | number^1^ | all)         | substring(\"foobar\",3,3)  |
| position,   |           | characters   | = \"oba\"                  |
| length?*)   |           | in *string*, | substring(\"foobar\",      |
|             |           | starting at  | -2, 1) = \"a\"*            |
|             |           | *start*      |                            |
|             |           |              | *                          |
|             |           | *position*.  | substring(\"\\U01F40Eab\", |
|             |           | 1st position | 2) = \"ab\" where          |
|             |           | is 1, last   | \"\\U01F40Eab\" is the     |
|             |           | position is  | representation of*         |
|             |           | -1           | 🐎***ab***                 |
+-------------+-----------+--------------+----------------------------+
| string      | > string  | return       | *string length(\"foo\") =  |
| len         |           | number of    | 3 string                   |
| gth(string) |           | characters   | length(\"\\U01F40Eab\") =  |
|             |           | (or code     | 3*                         |
|             |           | points) in   |                            |
|             |           | string.      |                            |
+-------------+-----------+--------------+----------------------------+
| upper       | > string  | return       | *upper case(\"aBc4\") =    |
| c           |           | uppercased   | \"ABC4\"*                  |
| ase(string) |           | string       |                            |
+-------------+-----------+--------------+----------------------------+
| lower       | > string  | return       | *lower case(\"aBc4\") =    |
| c           |           | lowercased   | \"abc4\"*                  |
| ase(string) |           | string       |                            |
+-------------+-----------+--------------+----------------------------+
| substring   | > string, | return       | *Substring                 |
| before      | > string  | substring of | before(\"foobar\",\"bar\") |
|             |           | string       | =*                         |
| (string,    |           | before the   |                            |
| match)      |           | match in     | *\"foo\" substring         |
|             |           | string       | before(\"foobar\",\"xyz\") |
|             |           |              | = \"\"*                    |
+-------------+-----------+--------------+----------------------------+
| substring   | > string, | return       | *substring                 |
| after       | > string  | substring of | after(\"foobar\", \"ob\")  |
|             |           | string after | = \"ar\" substring         |
| (string,    |           | the match in | after(\"\", \"a\") = \"\"* |
| match)      |           | string       |                            |
+-------------+-----------+--------------+----------------------------+
| rep         | > string2 | regular      | *repla                     |
| lace(input, |           | expression   | ce(\"banana\",\"a\",\"o\") |
| pattern,    |           | pattern      | = \"bonono\"*              |
| r           |           | matching and |                            |
| eplacement, |           | replacement  | *replace(\"abcd\",         |
| flags?)     |           |              | \"(ab)\|(a)\",*            |
|             |           |              |                            |
|             |           |              | *\"\[1=\$1\]\[2=\$2\]\") = |
|             |           |              | \"\[1=ab\]\[2=\]cd\"*      |
+-------------+-----------+--------------+----------------------------+
| conta       | > string  | does the     | *contains(\"foobar\",      |
| ins(string, |           | string       | \"of\") = false*           |
| match)      |           | contain the  |                            |
|             |           | match?       |                            |
+-------------+-----------+--------------+----------------------------+
| starts      | > string  | does the     | *starts with(\"foobar\",   |
| w           |           | string start | \"fo\") = true*            |
| ith(string, |           | with the     |                            |
| match)      |           | match?       |                            |
+-------------+-----------+--------------+----------------------------+
| ends with(  | > string  | does the     | *ends with(\"foobar\",     |
| string,     |           | string end   | \"r\") = true*             |
| match)      |           | with the     |                            |
|             |           | match?       |                            |
+-------------+-----------+--------------+----------------------------+
| mat         | > string2 | does the     | *matches(\"foobar\",       |
| ches(input, |           | input match  | \"\^fo\*b\") = true*       |
| pattern,    |           | the regexp   |                            |
| flags?)     |           | pattern?     |                            |
+-------------+-----------+--------------+----------------------------+
| split(      | >         | Splits the   | *split( "John Doe",        |
| string,     |  *string* | string into  | "\\\\s" ) = \["John",      |
| delimiter ) | > is a    | a list of    | "Doe"\] split( "a;b;c;;",  |
|             | > string, | substrings,  | ";" ) =*                   |
|             | > *d      | breaking at  |                            |
|             | elimiter* | each         | *\["a","b","c","",""\]*    |
|             | > is a    | occurrence   |                            |
|             | >         | of the       |                            |
|             |  pattern2 | delimiter    |                            |
|             |           | pattern.     |                            |
+-------------+-----------+--------------+----------------------------+
| string      | > *list*  | return a     | *string                    |
| join(list,  | > is a    | string which | j                          |
| delimiter)  | > list of | is composed  | oin(\[\"a\",\"b\",\"c\"\], |
|             | >         | by           | \"\_and\_\") =*            |
|             |  strings, |              |                            |
|             | > *d      | joining all  | *\"a_and_b_and_c\"*        |
|             | elimiter* | the string   |                            |
|             | > is a    | elements     | *string                    |
|             | > string  | from the     | j                          |
|             |           | list         | oin(\[\"a\",\"b\",\"c\"\], |
|             |           | parameter,   | \"\") = \"abc\" string     |
|             |           | separated by | j                          |
|             |           | the          | oin(\[\"a\",\"b\",\"c\"\], |
|             |           | delimiter.   | null) = \"abc\" string     |
|             |           | The          | join(\[\"a\"\], \"X\") =   |
|             |           | delimiter    | \"a\" string               |
|             |           | can be an    | join(\[\"a\",null,\"c\"\], |
|             |           | empty        | \"X\") = \"aXc\" string    |
|             |           | string. Null | join(\[\], \"X\") = \"\"*  |
|             |           | elements in  |                            |
|             |           | the list     |                            |
|             |           | parameter    |                            |
|             |           | are ignored. |                            |
|             |           |              |                            |
|             |           | If           |                            |
|             |           | ***list***   |                            |
|             |           | is empty,    |                            |
|             |           | the result   |                            |
|             |           | is the empty |                            |
|             |           | string.      |                            |
|             |           |              |                            |
|             |           | If           |                            |
|             |           | ***          |                            |
|             |           | delimiter*** |                            |
|             |           | is null, the |                            |
|             |           | string       |                            |
|             |           | elements are |                            |
|             |           | joined       |                            |
|             |           | without a    |                            |
|             |           | separator.   |                            |
+-------------+-----------+--------------+----------------------------+
| string      | > *list*  | return a     | *string                    |
| join(list)  | > is a    | string which | j                          |
|             | > list of | is composed  | oin(\[\"a\",\"b\",\"c\"\]) |
|             | > strings | by           | = \"abc\" string           |
|             |           |              | join(\[\"a\",null,\"c\"\]) |
|             |           | joining all  | = \"ac\" string join(\[\]) |
|             |           | the string   | = \"\"*                    |
|             |           | elements     |                            |
|             |           | from the     |                            |
|             |           | list         |                            |
|             |           | parameter    |                            |
|             |           |              |                            |
|             |           | Null         |                            |
|             |           | elements in  |                            |
|             |           | the list     |                            |
|             |           | parameter    |                            |
|             |           | are ignored. |                            |
|             |           |              |                            |
|             |           | If           |                            |
|             |           | ***list***   |                            |
|             |           | is empty,    |                            |
|             |           | the result   |                            |
|             |           | is the empty |                            |
|             |           | string.      |                            |
+-------------+-----------+--------------+----------------------------+

1.  *start position* must be a non-zero integer (0 scale number) in the
    range \[-L..L\], where L is the length of the string. *length* must
    be in the range \[1..E\], where E is L -- *start position* + 1 if
    *start position* is positive, and *--start position* otherwise.

2.  *pattern*, *replacement*, and *flags* SHALL conform to the syntax
    and constraints specified in clause 7.6 of XQuery 1.0 and XPath 2.0
    Functions and Operators. Note that where XPath specifies an error
    result, FEEL specifies a null result.

#### List functions

Table 75 defines list functions.

+---------------+-----------+---------------------+-------------------+
| > **Name(     | **Pa      | > **Description**   | > **Example**     |
| parameters)** | rameter** |                     |                   |
|               |           |                     |                   |
|               | *         |                     |                   |
|               | *Domain** |                     |                   |
+===============+===========+=====================+===================+
| > list        | > list,   | > does the *list*   | > *list           |
| > co          | > any     | > contain the       | > co              |
| ntains(*list, | > element | > *element*?        | ntains(\[1,2,3\], |
| > element*)   | > of the  |                     | > 2) = true*      |
|               | >         |                     |                   |
|               |  semantic |                     |                   |
|               | > domain  |                     |                   |
|               | >         |                     |                   |
|               | including |                     |                   |
|               | >         |                     |                   |
|               | >         |                     |                   |
|               |  **null** |                     |                   |
+---------------+-----------+---------------------+-------------------+
| >             | > list    | > return size of    | >                 |
| count(*list*) |           | > *list*, or zero   | *count(\[1,2,3\]) |
|               |           | > if *list* is      | > = 3 count(\[\]) |
|               |           | >                   | > = 0             |
|               |           | > empty             | > cou             |
|               |           |                     | nt(\[1,\[2,3\]\]) |
|               |           |                     | > =*              |
|               |           |                     | >                 |
|               |           |                     | > *2*             |
+---------------+-----------+---------------------+-------------------+
| > min(*list*) | >         | > return            | > *min(\[1,2,3\]) |
| >             |  non-empy | > minimum(maximum)  | > = 1 max(1,2,3)  |
| min(*c1,\..., | > list of | > item, or **null** | > = 3 min(1) =    |
| > cN*), *N*   | > c       | > if *list* is      | > min(\[1\]) = 1  |
| > \>0         | omparable | > empty             | > max(\[\]) =     |
| > max(*list*) | > items   |                     | > null*           |
| >             | > or      |                     |                   |
| max(*c1,\..., | >         |                     |                   |
| > cN*), *N*   |  argument |                     |                   |
| > \>0         | > list of |                     |                   |
|               | > one or  |                     |                   |
|               | > more    |                     |                   |
|               | > c       |                     |                   |
|               | omparable |                     |                   |
|               | > items   |                     |                   |
+---------------+-----------+---------------------+-------------------+
| > sum(*list*) | > list of | > return sum of     | > *sum(\[1,2,3\]) |
| >             | > 0 or    | > numbers, or       | > = 6 sum(1,2,3)  |
| >             | > more    | > **null** if       | > = 6 sum(1) = 1  |
| sum(*n1,\..., | > numbers | > *list* is empty   | > sum(\[\]) =     |
| > nN*), *N*   | > or      |                     | > **null***       |
| > \>0         | >         |                     |                   |
|               |  argument |                     |                   |
|               | > list of |                     |                   |
|               | > one or  |                     |                   |
|               | > more    |                     |                   |
|               | > numbers |                     |                   |
+---------------+-----------+---------------------+-------------------+
| >             | >         | > return arithmetic | > *mean           |
|  mean(*list*) | non-empty | > mean (average) of | > (\[1,2,3\]) = 2 |
| >             | > list of | > numbers           | > mean(1,2,3) = 2 |
| > m           | > numbers |                     | > mean(1) = 1     |
| ean(*n1,\..., | > or      |                     | > mean(\[\]) =    |
| > nN*), *N*   | >         |                     | > null*           |
| > \>0         |  argument |                     |                   |
|               | > list of |                     |                   |
|               | > one or  |                     |                   |
|               | > more    |                     |                   |
|               | > numbers |                     |                   |
+---------------+-----------+---------------------+-------------------+
| > all(*list*) | > list of | > return *false* if | *all(\[f          |
| >             | > Boolean | > any item is       | alse,null,true\]) |
| >             | > items   | > *false*, else     | = false all(true) |
| all(*b1,\..., | > or      | > *true* if empty   | = all(\[true\]) = |
| > bN*), *N*   | >         | > or all items are  | true all(\[\]) =  |
| > \>0         |  argument | > *true*, else      | true all(0) =     |
|               | > list of | > *null*            | null*             |
|               | > one or  |                     |                   |
|               | > more    |                     |                   |
|               | >         |                     |                   |
|               | > Boolean |                     |                   |
|               | > items   |                     |                   |
+---------------+-----------+---------------------+-------------------+
| > any(*list*) | > list of | > return *true* if  | > *any(\[f        |
| >             | > Boolean | > any item is       | alse,null,true\]) |
| >             | > items   | > *true*, else      | > = true          |
| any(*b1,\..., | > or      | > *false* if empty  | > any(false) =    |
| > bN*), *N*   | >         | > or all items are  | > false any(\[\]) |
| > \>0         |  argument | > *false*, else     | > = false any(0)  |
|               | > list of | > *null*            | > = null*         |
|               | > one or  |                     |                   |
|               | > more    |                     |                   |
|               | >         |                     |                   |
|               | > Boolean |                     |                   |
|               | > items   |                     |                   |
+---------------+-----------+---------------------+-------------------+
| > s           | > list,   | > return list of    | > *s              |
| ublist(*list, | > n       | > *length* (or all) | ublist(\[4,5,6\], |
| > start       | umber^1^, | > elements of       | > 1, 2) =         |
| > position,   | >         | > *list,* starting  | > \[4,5\]*        |
| > length?*)   | >         | > with *list\[start |                   |
|               | number^2^ | > position\]*.      |                   |
|               |           | >                   |                   |
|               |           | > 1st position is   |                   |
|               |           | > 1, last position  |                   |
|               |           | > is -1             |                   |
+---------------+-----------+---------------------+-------------------+
| >             | > list,   | > return new *list* | > *append(\[1\],  |
| append(*list, | > any     | > with *item*s      | > 2, 3) =         |
| > item\...*)  | > element | > appended          | > \[1,2,3\]*      |
|               | >         |                     |                   |
|               | including |                     |                   |
|               | >         |                     |                   |
|               |  **null** |                     |                   |
+---------------+-----------+---------------------+-------------------+
| > concatenat  | > list    | > return new *list* | > *concatena      |
| e(*list\...*) |           | > that is a         | te(\[1,2\],\[3\]) |
|               |           | > concatenation of  | > = \[1,2,3\]*    |
|               |           | > the arguments     |                   |
+---------------+-----------+---------------------+-------------------+
| > insert      | > list,   | > return new *list* | > *insert before  |
| >             | > n       | > with *newItem*    | > (\[1,3\], 1,2)  |
| before(*list, | umber^1^, | > inserted at       | > = \[2,1,3\]*    |
| > position,*  | > any     | > *position*        |                   |
| >             | > element |                     |                   |
| > *newItem*)  | >         |                     |                   |
|               | including |                     |                   |
|               | >         |                     |                   |
|               |  **null** |                     |                   |
+---------------+-----------+---------------------+-------------------+
| >             | > list,   | > *list* with item  | > *remove         |
| remove(*list, | >         | > at *position*     | > (\[1,2,3\], 2)  |
| > position*)  | number^1^ | > removed           | > = \[1,3\]*      |
+---------------+-----------+---------------------+-------------------+
| > list        | > list,   | > return new list   | > *list replace(  |
| > r           | >         | > with *newItem*    | > \[2, 4, 7, 8\], |
| eplace(*list, | number^1^ | > replaced at       | > 3, 6) = \[2, 4, |
| > position,   | > or      | > *position* (if    | > 6, 8\]*         |
| > newItem*)   | > boolean | > *position* is a   | >                 |
| >             | > funct   | > number) or return | > *list replace ( |
| > list        | ion(item, | > a new list where  | > \[2, 4, 7, 8\], |
| > r           | >         | > *newItem*         | > function(item,  |
| eplace(*list, | newItem), | > replaced at all   | > newItem) item   |
| > match,      | > any     | > positions where   | > \< newItem, 5)  |
| > newItem*)   | > element | > the *match*       | > = \[5, 5, 7,    |
|               | >         | > function returned | > 8\]*            |
|               | including | > *true*            |                   |
|               | > null    |                     |                   |
+---------------+-----------+---------------------+-------------------+
| > re          | > list    | > reverse the       | > *reverse        |
| verse(*list*) |           | > *list*            | > (\[1,2,3\]) =   |
|               |           |                     | > \[3,2,1\]*      |
+---------------+-----------+---------------------+-------------------+
| > index       | > list,   | > return ascending  | > *index          |
| > of(*list,   | > any     | > list of *list*    | >                 |
| > match*)     | > element | > positions         | of(\[1,2,3,2\],2) |
|               | >         | > containing        | > = \[2,4\]*      |
|               | including | > *match*           |                   |
|               | >         |                     |                   |
|               |  **null** |                     |                   |
+---------------+-----------+---------------------+-------------------+
| > unio        | > list    | > concatenate with  | > *union          |
| n(*list\...*) |           | > duplicate removal | >                 |
|               |           |                     | (\[1,2\],\[2,3\]) |
|               |           |                     | > = \[1,2,3\]*    |
+---------------+-----------+---------------------+-------------------+
| > distinct    | > list    | > duplicate removal | > *distinct       |
| > v           |           |                     | >                 |
| alues(*list*) |           |                     | values(\[1,2,3,2, |
|               |           |                     | > 1\]) =*         |
|               |           |                     | >                 |
|               |           |                     | > *\[1,2,3\]*     |
+---------------+-----------+---------------------+-------------------+
| > fl          | > list    | > flatten nested    | > *flatten        |
| atten(*list*) |           | > lists             | > (\[\            |
|               |           |                     | [1,2\],\[\[3\]\], |
|               |           |                     | > 4\]) =          |
|               |           |                     | > \[1,2,3,4\]*    |
+---------------+-----------+---------------------+-------------------+
| product(      | *list* is | > Returns the       | > *product(\[2,   |
| *list* )      | a list of | > product of the    | > 3, 4\]) = 24    |
| product(      | numbers.  | > numbers           | > product(\[\]) = |
| *n~1~, \...,  | *n~1~     |                     | > null product(2, |
| n~n~*)        | \...      |                     | > 3, 4) = 24*     |
|               | n~n~* are |                     |                   |
|               | numbers.  |                     |                   |
+---------------+-----------+---------------------+-------------------+
| median(       | *list* is | Returns the median  | > *median( 8, 2,  |
| *list* )      | a list of | element of the list | > 5, 3, 4 ) = 4   |
| median(       | number.   | of numbers. I.e.,   | > median( \[6, 1, |
| *n~1~, \...,  | *n~1~     | after sorting the   | > 2, 3\] ) = 2.5  |
| n~n~* )       | \...      | list, if the list   | > median( \[ \] ) |
|               | n~n~* are | has an odd number   | > = null*         |
|               | numbers.  | of elements, it     |                   |
|               |           | returns the middle  |                   |
|               |           | element. If the     |                   |
|               |           | list has an even    |                   |
|               |           | number of elements, |                   |
|               |           | returns the average |                   |
|               |           | of the two middle   |                   |
|               |           | elements. If the    |                   |
|               |           | list is empty,      |                   |
|               |           | returns null.       |                   |
+---------------+-----------+---------------------+-------------------+
| stddev(       | *list* is | Returns the         | > *stddev( 2, 4,  |
| *list* )      | a list of | **sample standard** | > 7, 5 ) =*       |
| stddev(       | number.   |                     | >                 |
| *n~1~, \...,  | *n~1~     | **deviation** of    | > *2.081665       |
| n~n~* )       | \...      | the list of         | 99946613273528229 |
|               | n~n~* are | numbers. If the     | > 7706979931*     |
|               | numbers.  | *list* is empty or  | >                 |
|               |           | if the *list*       | > *stddev( \[ 47  |
|               |           | contains only one   | > \] ) = null     |
|               |           | element, the        | > stddev( 47 ) =  |
|               |           | function returns    | > null*           |
|               |           | null.               |                   |
+---------------+-----------+---------------------+-------------------+
| mode( *list*  | *list* is | Returns the mode of | > *mode( 6, 3, 9, |
| ) mode(       | a list of | the list of         | > 6, 6 ) = \[ 6   |
| *n~1~, \...,  | number.   | numbers. If the     | > \] stddev( \[   |
| n~n~* )       | *n~1~     | result contains     | > \] ) = null*    |
|               | \...      | multiple elements,  | >                 |
|               | n~n~* are | they are returned   | > *mode( \[6, 1,  |
|               | numbers.  | in ascending order. | > 9, 6, 1\] ) =   |
|               |           | If the list is      | > \[ 1, 6 \]*     |
|               |           | empty, an empty     | >                 |
|               |           | list is returned.   | > *mode( \[ \] )  |
|               |           |                     | > = \[ \]*        |
+---------------+-----------+---------------------+-------------------+

1.  *position* must be a non-zero integer (0 scale number) in the range
    \[-L..L\], where L is the length of the list

2.  *length* must be in the range \[1..E\], where E is L -- *start
    position* + 1 if *start position* is positive, and *--start
    position* otherwise.

#### Numeric functions

Table 76 defines numeric functions.

**Table 76: Semantics of numeric functions**

+------------+-----------------+------------------+--------------------+
| **Name(par | **Parameter     | >                | > **Example**      |
| ameters)** | Domain**        |  **Description** |                    |
+============+=================+==================+====================+
| > d        | > number,       | > return *n*     | > *decimal(1/3, 2) |
| ecimal(*n, | > number^1^     | > with given     | > = .33            |
| > scale*)  |                 | > *scale*        | > decimal(1.5, 0)  |
|            |                 |                  | > = 2 decimal(2.   |
|            |                 |                  | > 5, 0) = 2*       |
+------------+-----------------+------------------+--------------------+
| >          | > number        | > Return n with  | *floor(1.5) = 1    |
| floor(*n*) | > number,       | > given scale    | floor(-1.56, 1) =  |
| >          | > number1       | > and rounding   | -1.6*              |
| floor(*n*, |                 | > mode flooring. |                    |
| > *scale*) |                 | >                |                    |
|            |                 | > If at least    |                    |
|            |                 | > one of n or    |                    |
|            |                 | > scale is       |                    |
|            |                 | > **null** the   |                    |
|            |                 | > result is      |                    |
|            |                 | > **null**.      |                    |
+------------+-----------------+------------------+--------------------+
| > ce       | > number        | > Return n with  | *ceiling(1.5) = 2  |
| iling(*n*) | > number,       | > given scale    | ceiling(-1.56, 1)  |
| > ce       | > number1       | > and rounding   | = -1.5*            |
| iling(*n*, |                 | > mode ceiling.  |                    |
| > *scale*) |                 | >                |                    |
|            |                 | > If at least    |                    |
|            |                 | > one of n or    |                    |
|            |                 | > scale is       |                    |
|            |                 | > **null** the   |                    |
|            |                 | > result is      |                    |
|            |                 | > **null**.      |                    |
+------------+-----------------+------------------+--------------------+
| round      | > number,       | > Return n with  | *round up(5.5, 0)  |
| up(*n*,    | > number1       | > given scale    | = 6 round up(-5.5, |
| *scale*)   |                 | > and rounding   | 0) = -6 round      |
|            |                 | > mode round up. | up(1.121, 2) =     |
|            |                 | >                | 1.13 round         |
|            |                 | > If at least    | up(-1.126, 2) =    |
|            |                 | > one of n or    | -1.13*             |
|            |                 | > scale is       |                    |
|            |                 | > **null** the   |                    |
|            |                 | > result is      |                    |
|            |                 | > **null**.      |                    |
+------------+-----------------+------------------+--------------------+
| > round    | > number,       | > Return n with  | *round down(5.5,   |
| >          | > number1       | > given scale    | 0) = 5 round down  |
|  down(*n*, |                 | > and rounding   | (-5.5, 0) = -5     |
| > *scale*) |                 | > mode round     | round down (1.121, |
|            |                 | > down.          | 2) = 1.12 round    |
|            |                 | >                | down (-1.126, 2) = |
|            |                 | > If at least    | -1.12*             |
|            |                 | > one of n or    |                    |
|            |                 | > scale is       |                    |
|            |                 | > **null** the   |                    |
|            |                 | > result is      |                    |
|            |                 | > **null**.      |                    |
+------------+-----------------+------------------+--------------------+
| > round    | > number,       | Return n with    | *round half        |
| > half     | > number1       | given scale and  | up(5.5, 0) = 6     |
| > up(*n*,  |                 | rounding mode    | round half         |
| > *scale*) |                 | round half up.   | up(-5.5, 0) = -6   |
|            |                 |                  | round half         |
|            |                 | > If at least    | up(1.121, 2) =     |
|            |                 | > one of n or    | 1.12 round half    |
|            |                 | > scale is       | up(-1.126, 2) =    |
|            |                 | > **null** the   | -1.13*             |
|            |                 | > result is      |                    |
|            |                 | > **null**.      |                    |
+------------+-----------------+------------------+--------------------+
| > round    | > number,       | > Return n with  | *round half down   |
| > half     | > number1       | > given scale    | (5.5, 0) = 5 round |
| >          |                 | > and rounding   | half down (-5.5,   |
|  down(*n*, |                 | > mode round up. | 0) = -5 round half |
| > *scale*) |                 | >                | down (1.121, 2) =  |
|            |                 | > If at least    | 1.12 round half    |
|            |                 | > one of n or    | down (-1.126, 2) = |
|            |                 | > scale is       | -*                 |
|            |                 | > **null** the   |                    |
|            |                 | > result is      | *1.13*             |
|            |                 | > **null**.      |                    |
+------------+-----------------+------------------+--------------------+
| > abs( *n* | > *n i*s a      | > Returns the    | > *abs( 10 ) = 10  |
| > )        | > number, a     | > absolute value | > abs( -10 ) = 10  |
|            | > days and time | > of *n*.        | > abs(@"PT5H") =   |
|            | > duration or a |                  | > @"PT5H"          |
|            | > year and      |                  | > abs(@"-PT5H") =  |
|            | > month         |                  | > @"PT5H"*         |
|            | > duration      |                  |                    |
+------------+-----------------+------------------+--------------------+
| > modulo(  | > *dividend*    | > Returns the    | > *modulo( 12, 5 ) |
| > *        | > and *divisor* | > remainder of   | > = 2              |
| dividend*, | > are numbers,  | > the division   | > modulo(-12,5)= 3 |
| >          | > where         | > of dividend by | > modulo(12,-5)=   |
|  *divisor* | > *divisor*     | > divisor.       | > -3               |
| > )        | > must not be 0 |                  | > modulo(-12,-5)=  |
|            | > (zero).       |                  | > -2 modulo(10. 1, |
|            | > Returns the   |                  | > 4.5)= 1.1        |
|            | > remainder of  |                  | > modulo(-10.1,    |
|            | > the division  |                  | > 4.5)= 3.4        |
|            | > of *dividend* |                  | > modulo(10.1,     |
|            | > by *divisor*. |                  | > -4.5)= -3.4      |
|            | > In case       |                  | > modulo(-10.1,    |
|            | > either        |                  | > -4.5)= -1.1*     |
|            | > *dividend* or |                  |                    |
|            | > *divisor* is  |                  |                    |
|            | > negative, the |                  |                    |
|            | > result has    |                  |                    |
|            | > the same sign |                  |                    |
|            | > of the        |                  |                    |
|            | > *divisor*.    |                  |                    |
|            | >               |                  |                    |
|            | > The modulo    |                  |                    |
|            | > function can  |                  |                    |
|            | > be expressed  |                  |                    |
|            | > as follows:   |                  |                    |
|            | >               |                  |                    |
|            | > modulo        |                  |                    |
|            | > (dividend,    |                  |                    |
|            | > divisor) =    |                  |                    |
|            | > dividend      |                  |                    |
|            | >               |                  |                    |
|            | > \-            |                  |                    |
|            | >               |                  |                    |
|            |  divisor\*floor |                  |                    |
|            | >               |                  |                    |
|            | > (dividen      |                  |                    |
|            | > d/divisor).   |                  |                    |
+------------+-----------------+------------------+--------------------+
| > sqrt(    | > *number* is a | > Returns the    | > *sqrt( 16 ) = 4* |
| > *number* | > number.       | > square root of |                    |
| > )        |                 | > the given      |                    |
|            |                 | > number. If     |                    |
|            |                 | > *number* is    |                    |
|            |                 | > negative it    |                    |
|            |                 | > returns null.  |                    |
+------------+-----------------+------------------+--------------------+
| > log(     | > *number* is a | > Returns the    | > *log( 10 ) =     |
| > *number* | > number        | > natural        | > 2.30258509299*   |
| > )        |                 | > logarithm      |                    |
|            |                 | > (base *e*) of  |                    |
|            |                 | > the *number*   |                    |
|            |                 | > parameter.     |                    |
+------------+-----------------+------------------+--------------------+
| > exp(     | > *number* is a | > Returns the    | *exp( 5 ) =        |
| > *number* | > number        | > Euler's number | 148.413159102577*  |
| > )        |                 | > *e* raised to  |                    |
|            |                 | > the power of   |                    |
|            |                 | > *number*.      |                    |
+------------+-----------------+------------------+--------------------+
| > odd(     | > *number* is a | > Returns true   | > *odd( 5 ) =      |
| > *number* | > number        | > if *number* is | > true* odd( 2 ) = |
| > )        |                 | > odd, false if  | > *false*          |
|            |                 | > it is even.    |                    |
+------------+-----------------+------------------+--------------------+
| even(      | > *number* is a | > Returns true   | *even( 5 ) =       |
| *number* ) | > number        | > if *number* is | false* even ( 2 )  |
|            |                 | > even, false if | = *true*           |
|            |                 | > it is odd.     |                    |
+------------+-----------------+------------------+--------------------+

1\. Scale is in the range \[−6111..6176\]

#### Date and time functions

Table 77 defines date and time functions.

**Table 77: Semantics of date and time functions**

+-----------------+----------------+----------------+-----------------+
| > **Nam         | > **Parameter  | > *            | **Example**     |
| e(parameters)** | > Domain**     | *Description** |                 |
+=================+================+================+=================+
| > is(*value1*,  | > Both are     | Returns        | *is(date(\      |
| > *value2*)     | > elements of  | **true** if    | "2012-12-25\"), |
|                 | > the **D**    | both values    | time            |
|                 |                | are the same   | (\"23:00:50"))* |
|                 |                | element in the | is **false**    |
|                 |                |                |                 |
|                 |                | FEEL semantic  | *is(date(\      |
|                 |                | domain **D**   | "2012-12-25\"), |
|                 |                |                | date(\"         |
|                 |                | (see 10.3.2.2) | 2012-12-25\"))* |
|                 |                |                | is **true**     |
|                 |                |                |                 |
|                 |                |                | *is(time(       |
|                 |                |                | \"23:00:50z\"), |
|                 |                |                | time            |
|                 |                |                | (\"23:00:50"))* |
|                 |                |                | is **false**    |
|                 |                |                |                 |
|                 |                |                | *is(time(       |
|                 |                |                | \"23:00:50z\"), |
|                 |                |                | time(\"23:      |
|                 |                |                | 00:50+00:00"))* |
|                 |                |                | is **true**     |
+-----------------+----------------+----------------+-----------------+

#### Range Functions

The following set of functions establish relationships between single
scalar values and ranges of such values. All functions in this list take
two arguments and return True if the relationship between the argument
holds, or False otherwise.

The specification of these functions is heavily inspired by the
equivalent functions in the HL7 CQL (Clinical Quality Language) standard
version 1.4.

*The following table intuitively depicts the relationships defined by
the functions in this chapter, but the full semantics of the functions
are listed in* Table 78.

![Table Description automatically
generated](media/image107.jpg){width="6.402361111111111in"
height="4.075694444444444in"}

+----------------------+----------------------+-----------------------+
| >                    | **Evaluates to true  | > **Example**         |
| **Name(parameters)** | if and only if (for  |                       |
|                      | each signature,      |                       |
|                      | respectively)**      |                       |
+======================+======================+=======================+
| > \(a\)              | > \(a\)              | > before( 1, 10 ) =   |
| > before(*point1*,   | >                    | > true before( 10, 1  |
| > *point2*)          | > point1 \< point2   | > ) = false           |
+----------------------+----------------------+-----------------------+
| > \(b\)              | > \(b\) point \<     | > before( 1,          |
| > before(*point*,    | > range.start or     | > \[1..10\] ) = false |
| > *range*)           | >                    | > before( 1, (1.10\]  |
|                      | > (point =           | > ) = true before( 1, |
|                      | > range.start and    | > \[5..10\] ) = true  |
|                      | >                    |                       |
|                      | > not(range.start    |                       |
|                      | > included) )        |                       |
+----------------------+----------------------+-----------------------+
| > \(c\)              | > \(c\)              | > before( \[1..10\],  |
| > before(*range*,    | >                    | > 10 ) = false        |
| > *point*)           | > range.end \< point | > before( \[1..10),   |
|                      | > or                 | > 10 ) = true before( |
|                      | >                    | > \[1..10\], 15 ) =   |
|                      | > (range.end = point | > true                |
|                      | >                    |                       |
|                      | > and                |                       |
|                      | >                    |                       |
|                      | > not(range.end      |                       |
|                      | > included) )        |                       |
+----------------------+----------------------+-----------------------+
| > \(d\)              | \(d\)                | > before( \[1..10\],  |
| > befor              |                      | > \[15..20\] ) = true |
| e(*range1*,*range2*) | range 1 .end \<      | > before( \[1..10\],  |
|                      | range2.start or      | > \[10..20\] ) =      |
|                      |                      | > false before(       |
|                      | (( not(range1 .end   | > \[1..10),           |
|                      | included) or         | > \[10..20\] ) = true |
|                      |                      | > before( \[1..10\],  |
|                      | not(range2.start     | > (10..20\] ) = true  |
|                      | included)) and       |                       |
|                      |                      |                       |
|                      | range 1 .end =       |                       |
|                      | range2.start)        |                       |
+----------------------+----------------------+-----------------------+
| > \(a\)              | > \(a\)              | > after( 10, 5 ) =    |
| > after(*point1*,    | >                    | > true after( 5, 10 ) |
| > *point2*)          | > point1 \> point2   | > = false             |
+----------------------+----------------------+-----------------------+
| > \(b\)              | > \(b\) point \>     | > after( 12,          |
| > after(*point*,     | > range.end or       | > \[1..10\] ) = true  |
| > *range*)           | >                    | > after( 10, \[1..10) |
|                      | > (point = range.end | > ) = true after( 10, |
|                      | > and                | > \[1..10\] ) = false |
|                      | >                    |                       |
|                      | > not(range.end      |                       |
|                      | > included) )        |                       |
+----------------------+----------------------+-----------------------+
| > \(c\) after(range, | > \(c\) range.start  | > after( \[11..20\],  |
| > point)             | > \> point or        | > 12 ) = false after( |
|                      | >                    | > \[11..20\], 10 ) =  |
|                      | > (range.start =     | > true after(         |
|                      | > point and          | > (11..20\], 11 ) =   |
|                      | >                    | > true after(         |
|                      | > not(range.start    | > \[11..20\], 11 ) =  |
|                      | > included) )        | > false               |
+----------------------+----------------------+-----------------------+
| > \(d\)              | > \(d\) range 1      | > after( \[11..20\],  |
| > after(*range1*,    | > .start \>          | > \[1..10\] ) = true  |
| > *range2*)          | > range2.end or      | > after( \[1..1 0\],  |
|                      | >                    | > \[11..20\] ) =      |
|                      | > (( not(range1      | > false after(        |
|                      | > .start included)   | > \[11..20\], \[1..   |
|                      | > or not(range2.end  | > 11) ) = true after( |
|                      | > included) ) and    | > (11..20\],          |
|                      | >                    | > \[1..11\] ) = true  |
|                      | > range 1 .start =   |                       |
|                      | > range2.end)        |                       |
+----------------------+----------------------+-----------------------+

+----------------------+----------------------+-----------------------+
| > \(a\)              | > \(a\)              | meets( \[1..5\],      |
| > meets(*range1*,    | >                    | \[5..10\] ) = true    |
| > *range2*)          | > range1.end         | meets( \[1..5),       |
|                      | > included and       | \[5..10\] ) = false   |
|                      | > range2.start       | meets( \[1..5\],      |
|                      | > included and       | (5..10\] ) = false    |
|                      | >                    | meets( \[1..5\],      |
|                      | > range 1 .end =     | \[6..10\] ) = false   |
|                      | > range2.start       |                       |
+======================+======================+=======================+
| > \(a\) met          | > \(a\) range1.start | met by( \[5..10\],    |
| > by(*range1*,       | > included and       | \[1..5\] ) = true met |
| > *range2*)          | > range2.end         | by( \[5..10\],        |
|                      | > included and       | \[1..5) ) = false met |
|                      | >                    | by( (5..10\],         |
|                      | > range 1 .start =   | \[1..5\] ) = false    |
|                      | > range2.end         | met by( \[6..10\],    |
|                      |                      | \[1..5\] ) = false    |
+----------------------+----------------------+-----------------------+
| > \(a\)              | > \(a\)              | overlaps( \[1..5\],   |
| > overlaps(*range1*, | >                    | \[3..8\] ) = true     |
| > *range2*)          | > (range1.end \>     | overlaps( \[3..8\],   |
|                      | > range2.start or    | \[1..5\] ) = true     |
|                      | >                    | overlaps( \[1..8\],   |
|                      | > (range1.end =      | \[3..5\] ) = true     |
|                      | > range2.start and   | overlaps( \[3..5\],   |
|                      | > range1.end         | \[1..8\] ) = true     |
|                      | > included and       | overlaps( \[1..5\],   |
|                      | > range2.start       | \[6..8\] ) = false    |
|                      | > included)) and     | overlaps( \[6..8\],   |
|                      | >                    | \[1..5\] ) = false    |
|                      | > (range1.start \<   | overlaps( \[1..5\],   |
|                      | > range2.end or      | \[5..8\] ) = true     |
|                      | >                    | overlaps( \[1..5\],   |
|                      | > (range1.start =    | (5..8\] ) = false     |
|                      | > range2.end and     | overlaps( \[1..5),    |
|                      | > range1.start       | \[5..8\] ) = false    |
|                      | > included and       | overlaps( \[1..5),    |
|                      | > range2.end         | (5. .8\] ) = false    |
|                      | > included))         | overlaps( \[5..8\],   |
|                      |                      | \[1..5\] ) = true     |
|                      |                      | overlaps( (5..8\],    |
|                      |                      | \[1..5\] ) = false    |
|                      |                      | overlaps( \[5..8\],   |
|                      |                      | \[1..5) ) = false     |
|                      |                      | overlaps( (5..8\],    |
|                      |                      | \[1..5) ) = false     |
+----------------------+----------------------+-----------------------+

+----------------------+----------------------+-----------------------+
| > \(a\) overlaps     | > \(a\)              | > overlaps before(    |
| > before(*range1*,   |                      | > \[1..5\], \[3..8\]  |
| > *range2*)          | (range1.start \<     | > ) = true overlaps   |
|                      | range2.start or      | > before( \[1..5\],   |
|                      |                      | > \[6..8\] ) = false  |
|                      | (range1.start =      | > overlaps before(    |
|                      | range2.start         | > \[1..5\], \[5..8\]  |
|                      |                      | > ) = true overlaps   |
|                      | and                  | > before( \[1..5\],   |
|                      |                      | > (5..8\] ) = false   |
|                      | range1.start         | > overlaps before(    |
|                      | included             | > \[1..5), \[5..8\] ) |
|                      |                      | > = false overlaps    |
|                      | and                  | > before( \[1..5),    |
|                      |                      | > (1. .5\] ) = true   |
|                      | not(range2.start     | > overlaps before(    |
|                      | included))) and      | > \[1..5\], (1..5\] ) |
|                      |                      | > = true overlaps     |
|                      | (range1.end \>       | > before( \[1..5),    |
|                      | range2.start or      | > \[1..5\] ) = false  |
|                      |                      | > overlaps before(    |
|                      | (range1.end =        | > \[1..5\], \[1..5\]  |
|                      | range2.start and     | > ) = false           |
|                      |                      |                       |
|                      | range1.end included  |                       |
|                      | and                  |                       |
|                      |                      |                       |
|                      | range2.start         |                       |
|                      | included)) and       |                       |
|                      |                      |                       |
|                      | (range1.end \<       |                       |
|                      | range2.end or        |                       |
|                      |                      |                       |
|                      | (range1.end =        |                       |
|                      | range2.end and       |                       |
|                      |                      |                       |
|                      | (not(range1.end      |                       |
|                      | included) or         |                       |
|                      |                      |                       |
|                      | range2.end included  |                       |
|                      | )))                  |                       |
+======================+======================+=======================+
| > \(a\) overlaps     | > \(a\)              | > overlaps after(     |
| > after(*range1*,    | >                    | > \[3..8\], \[1..5\]) |
| > *range2*)          | > (range2.start \<   | > = true overlaps     |
|                      | > range1.start or    | > after( \[6..8\],    |
|                      | >                    | > \[1..5\]) = false   |
|                      | > (range2.start =    | > overlaps after(     |
|                      | > range1.start       | > \[5..8\], \[1..5\]) |
|                      | >                    | > = true overlaps     |
|                      | > and                | > after( (5..8\],     |
|                      | >                    | > \[1..5\]) = false   |
|                      | > range2.start       | > overlaps after(     |
|                      | > included           | > \[5..8\], \[1..5))  |
|                      | >                    | > = false overlaps    |
|                      | > and                | > after( (1..5\],     |
|                      | >                    | > \[1..5) ) = true    |
|                      | > not( range 1.start | > overlaps after(     |
|                      | > included))) and    | > (1..5\], \[1..5\] ) |
|                      | >                    | > = true overlaps     |
|                      | > (range2.end \>     | > after( \[1..5\],    |
|                      | > range 1.start or   | > \[1..5) ) = false   |
|                      | >                    | > overlaps after(     |
|                      | > (range2.end =      | > \[1..5\], \[1..5\]  |
|                      | > range 1.start      | > ) = false           |
|                      | >                    |                       |
|                      | > and                |                       |
|                      | >                    |                       |
|                      | > range2.end         |                       |
|                      | > included and       |                       |
|                      | >                    |                       |
|                      | > range 1.start      |                       |
|                      | > included )) and    |                       |
|                      | >                    |                       |
|                      | > (range2.end \<     |                       |
|                      | > range1.end or      |                       |
|                      | >                    |                       |
|                      | > (range2.end =      |                       |
|                      | > range1.end and     |                       |
|                      | >                    |                       |
|                      | > (not(range2.end    |                       |
|                      | > included) or       |                       |
|                      | >                    |                       |
|                      | > range1.end         |                       |
|                      | > included)))        |                       |
+----------------------+----------------------+-----------------------+
| > \(a\)              | > \(a\) range.end    | > finishes( 10,       |
| > finishes(*point,   | > included and       | > \[1..10\] ) = true  |
| > range*)            | > range.end = point  | > finishes( 10,       |
|                      |                      | > \[1..10) ) = false  |
+----------------------+----------------------+-----------------------+

+----------------------+----------------------+-----------------------+
| > \(b\)              | > \(b\)              | finishes( \[5..10\],  |
| > finishes(*range1*, | >                    | \[1..10\] ) = true    |
| > *range2*)          | > range1.end         | finishes( \[5..10),   |
|                      | > included =         | \[1..10\] ) = false   |
|                      | > range2.end         | finishes( \[5..10),   |
|                      | > included and       | \[1..10) ) = true     |
|                      | >                    | finishes( \[1..10\],  |
|                      | > range1.end =       | \[1..10\] ) = true    |
|                      | > range2.end and     | finishes( (1..10\],   |
|                      | >                    | \[1..10\] ) = true    |
|                      | > (range1.start \>   |                       |
|                      | > range2.start or    |                       |
|                      | >                    |                       |
|                      | > (range1.start =    |                       |
|                      | > range2.start and   |                       |
|                      | >                    |                       |
|                      | > (not(range1.start  |                       |
|                      | > included) or       |                       |
|                      | >                    |                       |
|                      | > range2.start       |                       |
|                      | > included)))        |                       |
+======================+======================+=======================+
| > \(a\) finished     | > \(a\) range.end    | finished by(          |
| > by(*range, point*) | > included and       | \[1..10\], 10 ) =     |
|                      | > range.end = point  | true finished by(     |
|                      |                      | \[1..10), 10 ) =      |
|                      |                      | false                 |
+----------------------+----------------------+-----------------------+
| > \(b\) finished     | > \(b\) range1.end   | finished by(          |
| > by(*range1*,       | > included =         | \[1..10\], \[5..10\]  |
| > *range2*)          | > range2.end         | ) = true finished by( |
|                      | > included and       | \[1..10\], \[5..10) ) |
|                      | > range1.end =       | = false finished by(  |
|                      | > range2.end and     | \[1..10), \[5..10) )  |
|                      | >                    | = true finished by(   |
|                      | > (range1.start \<   | \[1..10\], \[1..10\]  |
|                      | > range2.start or    | ) = true finished by( |
|                      | >                    | \[1..10\], (1..10\] ) |
|                      | > (range1.start =    | = true                |
|                      | > range2.start and   |                       |
|                      | >                    |                       |
|                      | > (range1.start      |                       |
|                      | > included or        |                       |
|                      | > not(range2.start   |                       |
|                      | > included))))       |                       |
+----------------------+----------------------+-----------------------+
| > \(a\)              | > \(a\)              | includes( \[1..10\],  |
| > includes(*range*,  | >                    | 5 ) = true includes(  |
| > *point*)           | > (range.start \<    | \[1..10\], 12 ) =     |
|                      | > point and          | false includes(       |
|                      | > range.end \>       | \[1..10\], 1 ) = true |
|                      | > point) or          | includes( \[1..10\],  |
|                      | >                    | 10 ) = true includes( |
|                      | > (range.start =     | (1..10\], 1 ) = false |
|                      | > point and          | includes( \[1..10),   |
|                      | > range.start        | 10 ) = false          |
|                      | > included) or       |                       |
|                      | >                    |                       |
|                      | > (range.end = point |                       |
|                      | > and range.end      |                       |
|                      | > included)          |                       |
+----------------------+----------------------+-----------------------+

+----------------------+----------------------+-----------------------+
| > \(b\)              | > \(b\)              | > includes(           |
| > includes(*range1*, | >                    | > \[1..10\], \[4..6\] |
| > *range2*)          | > (range1.start \<   | > ) = true includes(  |
|                      | > range2.start or    | > \[1..10\], \[1..5\] |
|                      | >                    | > ) = true includes(  |
|                      | > (range1.start =    | > (1..10\], (1..5\] ) |
|                      | > range2.start and   | > = true includes(    |
|                      | >                    | > \[1..10\], (1..10)  |
|                      | > (range1.start      | > ) = true includes(  |
|                      | > included or        | > \[1..10), \[5..10)  |
|                      | > not(range2.start   | > ) = true includes(  |
|                      | > included)))) and   | > \[1..10\], \[1..10) |
|                      | >                    | > ) = true includes(  |
|                      | > (range1.end \>     | > \[1..10\], (1..10\] |
|                      | > range2.end or      | > ) = true includes(  |
|                      | >                    | > \[1..10\],          |
|                      | > (range1.end =      | > \[1..10\] ) = true  |
|                      | > range2.end and     |                       |
|                      | >                    |                       |
|                      | > (range1.end        |                       |
|                      | > included or        |                       |
|                      | > not(range2.end     |                       |
|                      | > included))))       |                       |
+======================+======================+=======================+
| > \(a\)              | > \(a\)              | > during( 5,          |
| > during(*point*,    | >                    | > \[1..10\] ) = true  |
| > *range*)           | > (range.start \<    | > during( 12,         |
|                      | > point and          | > \[1..10\] ) = false |
|                      | > range.end \>       | > during( 1,          |
|                      | > point) or          | > \[1..10\] ) = true  |
|                      | >                    | > during( 10,         |
|                      | > (range.start =     | > \[1..10\] ) = true  |
|                      | > point and          | > during( 1, (1..10\] |
|                      | > range.start        | > ) = false during(   |
|                      | > included) or       | > 10, \[1..10) ) =    |
|                      | >                    | > false               |
|                      | > (range.end = point |                       |
|                      | > and range.end      |                       |
|                      | > included)          |                       |
+----------------------+----------------------+-----------------------+
| > \(b\)              | > \(b\)              | during( \[4..6\],     |
| > during(*range1*,   | >                    | \[1..10\] ) = true    |
| > *range2*)          | > (range2.start \<   | during( \[1..5\],     |
|                      | > range1.start or    | \[1..10\] ) = true    |
|                      | >                    | during( (1..5\],      |
|                      | > (range2.start =    | (1..10\] ) = true     |
|                      | > range1.start and   | during( (1..10),      |
|                      | >                    | \[1..10\] ) = true    |
|                      | > (range2.start      | during( \[5..10),     |
|                      | > included or        | \[1..10) ) = true     |
|                      | > not(range1.start   | during( \[1..10),     |
|                      | > included)))) and   | \[1..10\] ) = true    |
|                      | >                    | during( (1..10\],     |
|                      | > (range2.end \>     | \[1..10\] ) = true    |
|                      | > range1.end or      | during( \[1..10\],    |
|                      | >                    | \[1..10\] ) = true    |
|                      | > (range2.end =      |                       |
|                      | > range1.end and     |                       |
|                      | >                    |                       |
|                      | > (range2.end        |                       |
|                      | > included or        |                       |
|                      | > not(range1.end     |                       |
|                      | > included))))       |                       |
+----------------------+----------------------+-----------------------+
| > \(a\)              | > \(a\) range.start  | starts( 1, \[1..10\]  |
| > starts(*point*,    | > = point and        | ) = true starts( 1,   |
| > *range*)           | > range.start        | (1..10\] ) = false    |
|                      | > included           | starts( 2, \[1..10\]  |
|                      |                      | ) = false             |
+----------------------+----------------------+-----------------------+
| > \(b\)              | > \(b\) range1.start | starts( \[1..5\],     |
| > starts(*range1*,   | > = range2.start and | \[1..10\] ) = true    |
| > *range2*)          | > range1.start       | starts( (1..5\],      |
|                      | > included =         | (1..10\] ) = true     |
|                      | > range2.start       | starts( (1..5\],      |
|                      | > included and       | \[1..10\] ) = false   |
|                      | >                    | starts( \[1..5\],     |
|                      | > (range1.end \<     | (1..10\] ) = false    |
|                      | > range2.end or      | starts( \[1..10\],    |
|                      | >                    | \[1..10\] ) = true    |
|                      | > (range1.end =      | starts( \[1..10),     |
|                      | > range2.end and     | \[1..10\] ) = true    |
|                      | >                    | starts( (1..10),      |
|                      | > (not(range1.end    | (1..10) ) = true      |
|                      | > included) or       |                       |
|                      | > range2.end         |                       |
|                      | > included)))        |                       |
+----------------------+----------------------+-----------------------+
| > \(a\) started      | > \(a\) range.start  | started by(           |
| > by(*range*,        | > = point and        | \[1..10\], 1 ) = true |
| > *point*)           | > range.start        | started by( (1..10\], |
|                      | > included           | 1 ) = false started   |
|                      |                      | by( \[1..10\], 2 ) =  |
|                      |                      | false                 |
+----------------------+----------------------+-----------------------+
| > \(b\) started      | > \(b\) range1.start | started by(           |
| > by(*range1*,       | > = range2.start and | \[1..10\], \[1..5\] ) |
| > *range2*)          | > range1.start       | = true started by(    |
|                      | > included =         | (1..10\], (1..5\] ) = |
|                      | > range2.start       | true started by(      |
|                      | > included and       | \[1..10\], (1..5\] )  |
|                      | >                    | = false started by(   |
|                      | > (range2.end \<     | (1..10\], \[1..5\] )  |
|                      | > range1.end or      | = false started by(   |
|                      | >                    | \[1..10\], \[1..10\]  |
|                      | > (range2.end =      | ) = true started by(  |
|                      | > range1.end and     | \[1..10\], \[1..10) ) |
|                      | >                    | = true started by(    |
|                      | > (not(range2.end    | (1..10), (1..10) ) =  |
|                      | > included) or       | true                  |
|                      | > range1.end         |                       |
|                      | > included)))        |                       |
+----------------------+----------------------+-----------------------+
| > \(a\)              | > \(a\) point1 =     | coincides( 5, 5 ) =   |
| >                    | > point2             | true coincides( 3, 4  |
|  coincides(*point1*, |                      | ) = false             |
| > *point2*)          |                      |                       |
+----------------------+----------------------+-----------------------+
| > \(b\)              | > \(b\) range1.start | coincides( \[1..5\],  |
| >                    | > = range2.start and | \[1..5\] ) = true     |
|  coincides(*range1*, | > range1.start       | coincides( (1..5),    |
| > *range2*)          | > included =         | \[1..5\] ) = false    |
|                      | > range2.start       | coincides( \[1..5\],  |
|                      | > included and       | \[2..6\] ) = false    |
|                      | > range1.end =       |                       |
|                      | > range2.end and     |                       |
|                      | > range1.end         |                       |
|                      | > included =         |                       |
|                      | > range2.end         |                       |
|                      | > included           |                       |
+----------------------+----------------------+-----------------------+

#### Temporal built-in functions

The following set of functions provide common support utilities when
dealing with date or date and time values; listed in Table 79.

+----------------+----------------+----------------+-----------------+
| > **Name       | > **Parameter  | *              | > **Example**   |
| (parameters)** | > Domain**     | *Description** |                 |
+================+================+================+=================+
| > day of year( | > date or date | returns the    | > day of year(  |
| > date )       | > and time     | Gregorian      | > date(2019, 9, |
|                |                | number of the  | >               |
|                |                | day within the | > 17\) ) = 260  |
|                |                | year           |                 |
+----------------+----------------+----------------+-----------------+
| > day of week( | > date or date | returns the    | > day of week(  |
| > date )       | > and time     | day of the     | > date(2019, 9, |
|                |                | week according | > 17)           |
|                |                | to the         | >               |
|                |                | Gregorian      | > ) =           |
|                |                | calendar       | > \"Tuesday\"   |
|                |                | enumeration:   |                 |
|                |                | "Monday",      |                 |
|                |                |                |                 |
|                |                | "Tuesday",     |                 |
|                |                | "Wednesday",   |                 |
|                |                |                |                 |
|                |                | "Thursday",    |                 |
|                |                | "Friday",      |                 |
|                |                |                |                 |
|                |                | "Saturday",    |                 |
|                |                | "Sunday"       |                 |
+----------------+----------------+----------------+-----------------+
| > month of     | > date or date | returns the    | > month of      |
| > year( date ) | > and time     | month of the   | > year(         |
|                |                | year according | > date(2019, 9, |
|                |                | to the         | >               |
|                |                | Gregorian      | > 17\) ) =      |
|                |                | calendar       | > \"September\" |
|                |                | enumeration:   |                 |
|                |                | "January",     |                 |
|                |                | "February",    |                 |
|                |                |                |                 |
|                |                | "March",       |                 |
|                |                | "April",       |                 |
|                |                | "May",         |                 |
|                |                |                |                 |
|                |                | "June",        |                 |
|                |                | "July",        |                 |
|                |                | "August",      |                 |
|                |                |                |                 |
|                |                | "September",   |                 |
|                |                | "October",     |                 |
|                |                |                |                 |
|                |                | "November",    |                 |
|                |                | "December"     |                 |
+----------------+----------------+----------------+-----------------+
| > week of      | > date or date | returns the    | > week of year( |
| > year( date ) | > and time     | Gregorian      | > date(2019, 9, |
|                |                | number of the  | >               |
|                |                | week within    | > 17\) ) = 38   |
|                |                | the year,      | > week of year( |
|                |                | accordingly to | > date(2003,    |
|                |                |                | > 12,           |
|                |                | ISO 8601       | >               |
|                |                |                | > 29\) ) = 1    |
|                |                |                | > week of year( |
|                |                |                | > date(2004, 1, |
|                |                |                | >               |
|                |                |                | > 4\) ) = 1     |
|                |                |                | > week of year( |
|                |                |                | > date(2005, 1, |
|                |                |                | >               |
|                |                |                | > 1\) ) = 53    |
|                |                |                | > week of year( |
|                |                |                | > date(2005, 1, |
|                |                |                | >               |
|                |                |                | > 3\) ) = 1     |
|                |                |                | > week of year( |
|                |                |                | > date(2005, 1, |
|                |                |                | >               |
|                |                |                | > 9\) ) = 1     |
+----------------+----------------+----------------+-----------------+

#### Sort

Sort a list using an ordering function. For example,

> sort(list: \[3,1,4,5,2\], precedes: function(x,y) x \< y) =
> \[1,2,3,4,5\]

+------------------------------+---------------------------------------+
| > **Parameter name** (\*     | > **Domain**                          |
| > means optional)            |                                       |
+==============================+=======================================+
| > list                       | > list of any element, be careful     |
|                              | > with nulls                          |
+------------------------------+---------------------------------------+
| > precedes                   | boolean function of 2 arguments       |
|                              | defined on every pair of list         |
|                              | elements                              |
+------------------------------+---------------------------------------+

#### Context function

+-----------------+----------------+----------------+-----------------+
| > **Nam         | > **Parameter  | > *            | > **Example**   |
| e(parameters)** | > domain**     | *Description** |                 |
+=================+================+================+=================+
| > get value(m,  | > context,     | > select the   | > *get value    |
| > key)          | > string       | > value of the | > ({key1 :      |
|                 |                | > entry named  | > \"value1\"},  |
|                 |                | > key from     | > \"key1 \") =  |
|                 |                | > context m    | > \"value1\"    |
|                 |                |                | > get value     |
|                 |                |                | > ({key1 :      |
|                 |                |                | > \"value 1\"}, |
|                 |                |                | > \"un          |
|                 |                |                | existent-key\") |
|                 |                |                | > = null*       |
+-----------------+----------------+----------------+-----------------+
| > get           | > context      | > produces a   | > *get          |
| > entries(m)    |                | > list of      | > entries({key1 |
|                 |                | > key,value    | > : \"value 1   |
|                 |                | > pairs from a | > \", key2 :    |
|                 |                | > context m    | > \"value2\"})  |
|                 |                |                | > = \[ { key :  |
|                 |                |                | > \"key1 \",    |
|                 |                |                | > value :       |
|                 |                |                | > \"value 1\"   |
|                 |                |                | > }, {key :     |
|                 |                |                | > \"key2\",     |
|                 |                |                | > value :*      |
|                 |                |                | >               |
|                 |                |                | > *\"value2\"}  |
|                 |                |                | > \]*           |
+-----------------+----------------+----------------+-----------------+
| > c             | > *entries* is | > Returns a    | > *contex       |
| ontext(entries) | > a list of    | > new context  | t(\[{key:\"a\", |
|                 | > contexts,    | > that         | > value:1},     |
|                 | > each context | > includes all | > {key:\"b\",   |
|                 | > item SHALL   | > specified    | > value:2}\]) = |
|                 | > have two     | > entries.     | > {a:1, b:2}*   |
|                 | > entries      | >              | >               |
|                 | > having keys: | > If a context | > *contex       |
|                 | >              | > item         | t(\[{key:\"a\", |
|                 | > \"key\" and  | > contains     | > value:1},*    |
|                 | > \"value\",   | > additional   | >               |
|                 | >              | > entries      | > *{key:\"b\",  |
|                 |  respectively. | > beyond the   | > value:2,      |
|                 |                | > required     | > something:*   |
|                 |                | > \"key\" and  | >               |
|                 |                | > \"value\"    | > *\"else\"}\]) |
|                 |                | > entries, the | > = {a:1, b:2}* |
|                 |                | > additional   | >               |
|                 |                | > entries are  | > *contex       |
|                 |                | > ignored.     | t(\[{key:\"a\", |
|                 |                | >              | > value:1},*    |
|                 |                | > If a context | >               |
|                 |                | > item is      | >               |
|                 |                | > missing the  | *{key:\"b\"}\]) |
|                 |                | > required     | > = null*       |
|                 |                | > \"key\" and  |                 |
|                 |                | > \"value\"    |                 |
|                 |                | > entries, the |                 |
|                 |                | > final result |                 |
|                 |                | > is null.     |                 |
|                 |                | >              |                 |
|                 |                | > See also:    |                 |
|                 |                | > *get         |                 |
|                 |                | > entries()*   |                 |
|                 |                | > builtin      |                 |
|                 |                | > function.    |                 |
+-----------------+----------------+----------------+-----------------+
| > \(a\) context | > \(a\)        | > \(a\)        | > *context      |
| > put(context,  | > *context* is | > Returns a    | > put({x:1},    |
| > key, value)   | > a context,   | > new context  | > \"y\", 2) =   |
|                 | > *key* is a   | > that         | > {x:1, y:2}    |
|                 | > string,      | > includes the | > context       |
|                 | > *value* is   | > new entry,   | > put({x:1,     |
|                 | > Any type     | > or           | > y:0}, \"y\",  |
|                 |                | > overriding   | > 2) =*         |
|                 |                | > the existing | >               |
|                 |                | > value if an  | > *{x:1, y:2}   |
|                 |                | > entry for    | > context       |
|                 |                | > the same key | > put({x:1,     |
|                 |                | > already      | > y:0, z:0},    |
|                 |                | > exists in    | > \"y\",*       |
|                 |                | > the supplied | >               |
|                 |                | > context      | > *2) = {x:1,   |
|                 |                | > parameter.   | > y:2, z:0}*    |
|                 |                | >              | >               |
|                 |                | > A new entry  | > *context      |
|                 |                | > is added as  | > put({x:1},    |
|                 |                | > the last     | > \[\"y\"\], 2) |
|                 |                | > entry of the | > = context     |
|                 |                | > new context. | > put({x:1},    |
|                 |                | > If           | > \"y\", 2) =   |
|                 |                | > overriding   | > {x:1, y:2}*   |
|                 |                | > an existing  |                 |
|                 |                | > entry, the   |                 |
|                 |                | > order of the |                 |
|                 |                | > keys         |                 |
|                 |                | > maintains    |                 |
|                 |                | > the same     |                 |
|                 |                | > order as in  |                 |
|                 |                | > the original |                 |
|                 |                | > context.     |                 |
+-----------------+----------------+----------------+-----------------+
| > \(b\) context | > \(b\)        | \(b\) Returns  | *context        |
| > put(context,  | > *context* is | the composite  | put({x:1, y:    |
| > keys, value)  | > a context,   | of nested      | {a: 0} },       |
|                 | > *keys* is a  | invocations to | \[\"y\",        |
|                 | > list of      | *context       | \"a\"\], 2)*    |
|                 | > string,      | put()* for     |                 |
|                 | > *value* is   | each item in   | *= context      |
|                 | > Any type     | *keys*         | put({x:1, y:    |
|                 |                | hierarchy in   | {a: 0} },*      |
|                 |                | *context*.     |                 |
|                 |                |                | *\"y\", context |
|                 |                | If keys is a   | put({a: 0},     |
|                 |                | list of 1      | \[\"a\"\], 2))* |
|                 |                | element, this  |                 |
|                 |                | is equivalent  | *= {x:1, y: {a: |
|                 |                | to *context    | 2} }*           |
|                 |                | put(context,   |                 |
|                 |                | key\',         | *context        |
|                 |                | value)*, where | put({x:1, y:    |
|                 |                | *key\'* is the | {a: 0} }, \[\], |
|                 |                | only element   | 2) = null*      |
|                 |                | in the list    |                 |
|                 |                | *keys*.        |                 |
|                 |                |                |                 |
|                 |                | If keys is a   |                 |
|                 |                | list of 2 or   |                 |
|                 |                | more elements, |                 |
|                 |                | this is        |                 |
|                 |                | equivalent of  |                 |
|                 |                | calling        |                 |
|                 |                | *context       |                 |
|                 |                | put(context,   |                 |
|                 |                | key\',         |                 |
|                 |                | value\')*,     |                 |
|                 |                | with:          |                 |
|                 |                |                |                 |
|                 |                | *key\'* is the |                 |
|                 |                | head element   |                 |
|                 |                | in the list    |                 |
|                 |                | *keys*,        |                 |
|                 |                | *value\'* is   |                 |
|                 |                | the result of  |                 |
|                 |                | invocation of  |                 |
|                 |                | *context       |                 |
|                 |                | put(context\', |                 |
|                 |                | keys\',        |                 |
|                 |                | value)*,       |                 |
|                 |                | where:         |                 |
|                 |                |                |                 |
|                 |                | *context\'* is |                 |
|                 |                | the result of  |                 |
|                 |                | context.key\', |                 |
|                 |                | *keys\'* is    |                 |
|                 |                | the remainder  |                 |
|                 |                | of the list    |                 |
|                 |                | *keys* without |                 |
|                 |                | the head       |                 |
|                 |                | element        |                 |
|                 |                | *key\'*.       |                 |
|                 |                |                |                 |
|                 |                | If keys is an  |                 |
|                 |                | empty list or  |                 |
|                 |                | null, the      |                 |
|                 |                | result is      |                 |
|                 |                | null.          |                 |
+-----------------+----------------+----------------+-----------------+
| > context       | > *contexts*   | Returns a new  | *context        |
| >               | > is a list of | context that   | merge(\[{x:1},  |
| merge(contexts) | > contexts     | includes all   | {y:2}\]) =*     |
|                 |                | entries from   |                 |
|                 |                | the given      | *{x:1, y:2}*    |
|                 |                | contexts; if   |                 |
|                 |                | some of the    | *context        |
|                 |                | keys are       | merge(\[{x:1,   |
|                 |                | equal, the     | y:0},*          |
|                 |                | entries are    |                 |
|                 |                | overriden.     | *{y:2}\]) =     |
|                 |                |                | {x:1, y:2}*     |
|                 |                | The entries    |                 |
|                 |                | are overridden |                 |
|                 |                | in the same    |                 |
|                 |                | order as       |                 |
|                 |                | specified by   |                 |
|                 |                | the supplied   |                 |
|                 |                | parameter,     |                 |
|                 |                | with new       |                 |
|                 |                | entries added  |                 |
|                 |                | as the last    |                 |
|                 |                | entry in the   |                 |
|                 |                | new context.   |                 |
+-----------------+----------------+----------------+-----------------+

#### Miscellaneous functions

The following set of functions provide support utilities for several
miscellaneous use-cases. For example, when a decision depends on the
current date, like deciding the support SLA over the weekends,
additional charges for weekend delivery, etc.

It is important to note that the functions in this section are intended
to be side-effect-free, but they are not deterministic and not
idempotent from the perspective of an external observer.

Vendors are encouraged to guide end-users in ensuring deterministic
behavior of the DMN model during testing, for example, through specific
configuration.

Users are encouraged to isolate decision logic that uses these functions
in specific DRG elements, such as Decisions. This encapsulation enables
them to be overridden with synthetic values that remain constant across
executions of the DMN model\'s test cases.

  -----------------------------------------------------------------------
  **Name(parameters)**    **Parameter domain**    **Description**
  ----------------------- ----------------------- -----------------------
  now()                   (none)                  returns current date
                                                  and time

  today()                 (none)                  returns current date
  -----------------------------------------------------------------------

## Execution Semantics of Decision Services

FEEL gives execution semantics to decision services defined in decision
models where FEEL is the expression language. A decision service is
semantically equivalent to a FEEL function whose parameters are the
decision service inputs, and whose logic is a context assembled from the
decision service\'s decisions and knowledge requirements.

Decision service implementations SHALL return a result as described
above, and MAY return additional information such as intermediate
results, log records, debugging information, error messages, rule
annotations, etc. The format of any additional information is left
unspecified.

Every FEEL expression in a decision model has execution semantics.
LiteralExpression (FEEL text) semantics is defined in 10.3. Boxed
expressions described in 10.2.2 can be mapped to FEEL text and thus also
have execution semantics.

Recall that a DecisionService is defined by four lists: inputData,
inputDecisions, outputDecisions, and encapsulatedDecisions. The lists
are not independent and thus not all required to be specified, e.g.,
each required decision (direct and indirect) of the outputDecisions must
be an encapsulatedDecision, an inputDecision, or required by an
inputDecision. For simplicity in the following, we assume that all four
lists are correctly and completely specified.

A DecisionService is given execution semantics by mapping it to a FEEL
function *F*. Let S be a

DecisionService with input data *id1*, *id2*, \..., input decisions
*di1*, *di2*, \..., encapsulated decisions *de1*, *de2*, \..., and
output decisions *do1*, *do2*, \.... Each input data *idi* has a
qualified name *nid~i~*. Each decision *di* has a qualified name
*nd~i\ ~*and a decision logic expression *ed*. The decisions may have
knowledge requirements. In particular the decisions may require
BusinessKnowledgeModels *bkm1*, *bkm2*, \... and DecisionServices *s1*,
*s2*, \.... BusinessKnowledgeModels have qualified names *nbkm~i\ ~*and
encapsulatedLogic *f~bkmi~*. DecisionServices have qualified names *nsi*
and equivalent logic *fs~i~*, where the equivalent logic is defined
recursively, binding *si* to S.

The syntax for FEEL function *F* is *funcion(nid~1~, nid~2~, \...,
ndi~1~, ndi~2~, \... ) C.result*, where *C* is the context *{*

> *ns~1~ : fs~1~, ns~2~ : fs~2~, \...,*
>
> *nbkm1 : fbkm1, nbkm2 : fbkm2, \...,*
>
> *nde~1~ : ede~1~, nde~2~ : ede~2~, \...,*
>
> *result: { ndo~1~ : edo~1~, ndo~2~ : edo~2~, . ..}*

such that *si*, *bkmi*, *dei* and *doi* are partially ordered by
requirements (e.g., the context entry for a required decision comes
before a decision that requires it).

The qualified name of an element named E (decision, input data, decision
service, or BKM) that is defined in the same decision model as S is
simply E. Otherwise, the qualified name is I.E, where I is the name of
the import element that refers to the model where E is defined.

The execution semantics of S is FEEL(*F*): a function that when invoked
with values from the FEEL semantic domain bound to the parameters
representing input data and input decisions, returns:

-   In the case of a single output decision(s), the single decision\'s
    > output value.

-   In the case of multiple output decisions, a context consisting of
    > all the output decisions\' output values.

XML elements SHALL map to the FEEL semantic domain as specified in
section 10.3.3. Otherwise, details of the syntax of input/output data
values and mapping to/from FEEL are undefined.

## Metamodel

![](media/image108.png){width="6.772222222222222in"
height="5.043055555555555in"}

**Figure 10-27: Expression class diagram**

The class Expression is extended to support the four new kinds of boxed
expressions introduced by FEEL, namely: Context, FunctionDefinition,
Relation and List.

Boxed expressions are Expressions that have a standard diagrammatic
representation (see clauses 7.2.1 and 10.2.1). FEEL *contexts*,
*function definitions*, *relations* and *lists* SHOULD be modeled as
Context, FunctionDefinition, Relation and List elements, respectively,
and represented as a boxed expression whenever possible; that is, when
they are top-level expressions, since an instance of LiteralExpression
cannot contain another Expression element.

### Context metamodel

A Context is composed of any number of contextEntrys, which are
instances of ContextEntry.

A Context element is represented diagrammatically as a **boxed context**
(clause 10.2.1.4). A FEEL *context* (grammar rule 57 and clause
10.3.2.6) SHOULD be modeled as a Context element whenever possible.

Context inherits all the attributes and model associations from
Expression. Table 83 presents the additional attributes and model
associations of the Context element.

+-----------------------------+----------------------------------------+
| > **Attribute**             | > **Description**                      |
+=============================+========================================+
| > **contextEntry**:         | This attributes lists the instances of |
| > ContextEntry \[\*\]       | ContextEntry that compose this         |
|                             | Context.                               |
+-----------------------------+----------------------------------------+

### ContextEntry metamodel

The class ContextEntry is used to model FEEL *context entries* when a
*context* is modeled as a Context element. ContextEntry is a
specialization of DMNElement, from which it inherits the optional id,
description, and label attributes.

An instance of ContextEntry is composed of an optional variable, which
is an InformationItem element whose name is the *key* in the *context
entry*, and of a value, which is the instance of Expression that models
the *expression* in the *context entry*.

**Table *84*** presents the attributes and model associations of the
ContextEntry element.

+-----------------------------+----------------------------------------+
| > **Attribute**             | > **Description**                      |
+=============================+========================================+
| > **variable**:             | The instance of InformationItem that   |
| > InformationItem \[0..1\]  | is contained in this ContextEntry, and |
|                             | whose name is the *key* in the modeled |
|                             | *context* *entry*                      |
+-----------------------------+----------------------------------------+
| > **value**: Expression     | The instance of Expression that is the |
|                             | *expression* in this                   |
|                             |                                        |
|                             | ContextEntry                           |
+-----------------------------+----------------------------------------+

###  FunctionDefinition metamodel

A FunctionDefinition has formalParameters and a body. A
FunctionDefinition element is

represented diagrammatically as a **boxed function**, as described in
clause. A FEEL *function definition* (grammar rule 55 and clause
10.3.2.15) SHOULD be modeled as a FunctionDefinition element whenever
possible.

FunctionDefinition inherits all the attributes and model associations
from Expression. Table 85 presents the additional attributes and model
associations of the Function Definition element.

**Table 85: FunctionDefinition attributes and model associations**

+-----------------------------+----------------------------------------+
| > **Attribute**             | > **Description**                      |
+=============================+========================================+
| > **FormalParameter**:      | This attributes lists the instances of |
| > InformationItem \[\*\]    | InformationItem that are the           |
|                             | parameters of this Context.            |
+-----------------------------+----------------------------------------+
| > **body**: Expression      | The instance of Expression that is the |
| > \[0..1\]                  | body in this                           |
|                             |                                        |
|                             | FunctionDefinition                     |
+-----------------------------+----------------------------------------+
| **kind**: FunctionKind =    | The kind attribute defines the type of |
| FEEL                        | the FunctionDefinition.                |
|                             |                                        |
| { FEEL \| Java \| PMML }    | The default value is FEEL. Supported   |
|                             | values also include Java and           |
|                             |                                        |
|                             | PMML                                   |
+-----------------------------+----------------------------------------+

### List metamodel

A List is simply a list of element, which are instances of Expressions.
A List element is represented diagrammatically as a **boxed list**, as
described in clause 10.2.1.5. A FEEL *list* (grammar rule 54 and clause
10.3.2.15) SHOULD be modeled as a List element whenever possible.

List inherits all the attributes and model associations from Expression.
Table 86 presents the additional attributes and model associations of
the List element.

+-----------------------------+----------------------------------------+
| > **Attribute**             | > **Description**                      |
+=============================+========================================+
| > **element**: Expression   | This attributes lists the instances of |
| > \[\*\]                    | Expression that are the elements in    |
|                             | this List.                             |
+-----------------------------+----------------------------------------+

### Relation metamodel

A Relation is convenient shorthand for a list of similar contexts. A
Relation has a column instead of repeated ContextEntrys, and a List is
used for every row, with one of the List's expression for each column
value.

Relation inherits all the attributes and model associations from
Expression. Table 87 presents the additional attributes and model
associations of the Relation element.

**Table 87: Relation attributes and model associations**

+-----------------------------+----------------------------------------+
| > **Attribute**             | > **Description**                      |
+=============================+========================================+
| > **row**: List \[\*\]      | This attributes lists the instances of |
|                             | List that compose the rows of this     |
|                             | Relation.                              |
+-----------------------------+----------------------------------------+
| > **column**:               | This attributes lists the instances of |
| > InformationItem \[\*\]    | InformationItem that define the        |
|                             | columns in this Relation.              |
+-----------------------------+----------------------------------------+

### Conditional metamodel

A Conditional is a visual way to express an if statement.

Conditional inherits all the attributes and model associations from
Expression. Table 88 presents the additional attributes and model
associations of the Conditional element.

**Table 88: Conditional attributes and model associations**

+----------------------+-----------------------------------------------+
| > **Attribute**      | > **Description**                             |
+======================+===============================================+
| **if**:              | > This attribute holds the expression that is |
| ChildExpression      | > evaluate by the conditional expression.     |
+----------------------+-----------------------------------------------+
| **then**:            | > This attribute holds the expression that    |
| ChildExpression      | > will be evaluated when the condition in the |
|                      | > if statement evaluates to **true**.         |
+----------------------+-----------------------------------------------+
| **else**:            | > This attribute holds the expression that    |
| ChildExpression      | > will be evaluated when the condition in the |
|                      | > if statement evaluates to **false**.        |
+----------------------+-----------------------------------------------+

### ChildExpression metamodel

A ChildExpression is used to hold an expression inside a node. Table 89
presents the attributes of a

ChildExpression.

+-----------------------------------+----------------------------------+
| > **Attribute**                   | > **Description**                |
+===================================+==================================+
| > **id**: ID\[0..1\]              | Optional identifier for this     |
|                                   | element. SHALL be unique within  |
|                                   | its containing Definitions       |
|                                   | element.                         |
+-----------------------------------+----------------------------------+
| > **value**: Expression           | The instance of Expression that  |
|                                   | is the expression in this        |
|                                   |                                  |
|                                   | ChildExpression                  |
+-----------------------------------+----------------------------------+

### Filter metamodel

A Filter is a visual way to express list filtering.

Filter inherits all the attributes and model associations from
Expression. Table XX presents the additional attributes and model
associations of the Filter element.

+-----------------------------------+----------------------------------+
| > **Attribute**                   | > **Description**                |
+===================================+==================================+
| > **in**: ChildExpression         | This attribute holds the         |
|                                   | expression that is evaluate as   |
|                                   | the collection to be filtered.   |
+-----------------------------------+----------------------------------+
| > **match**: ChildExpression      | This attribute holds the         |
|                                   | expression that is used to       |
|                                   | filter the collection.           |
+-----------------------------------+----------------------------------+

### Iterator metamodel

An Iterator is the abstract class for all boxed iteration.

Iterator inherits all the attributes and model associations from
Expression. Table 91 presents the additional attributes and model
associations of the Iterator element.

**Table 91: Iterator attributes and model associations**

+-----------------------------------+----------------------------------+
| > **Attribute**                   | > **Description**                |
+===================================+==================================+
| > **iteratorVariable**: String    | This attribute holds name of the |
|                                   | iterator variable that will be   |
|                                   | populated at each iteration.     |
+-----------------------------------+----------------------------------+
| > **in**: TypedChildExpression    | This attribute holds the         |
|                                   | expression that is evaluated as  |
|                                   | the collection to be processed.  |
+-----------------------------------+----------------------------------+

### For metamodel

A For is a representation of a loop.

For inherits all the attributes and model associations from Iterator.
Table 92 presents the additional attributes and model associations of
the For element.

**Table 92: For attributes and model associations**

+-----------------------------------+----------------------------------+
| > **Attribute**                   | > **Description**                |
+===================================+==================================+
| > **return**: ChildExpression     | This attribute holds the         |
|                                   | expression that is evaluated to  |
|                                   | create the new collection that   |
|                                   | will be returned.                |
+-----------------------------------+----------------------------------+

### Quantified metamodel

A Quantified is an abstraction of an expression that is evaluated on
each item of a collection.

Quantified inherits all the attributes and model associations from
Iterator. Table XX presents the additional attributes and model
associations of Quantified.

**Table 93: Quantified attributes and model associations**

+-----------------------------------+----------------------------------+
| > **Attribute**                   | > **Description**                |
+===================================+==================================+
| > **satisfies**: ChildExpression  | This attribute holds the         |
|                                   | expression that is evaluated to  |
|                                   | determine if the current item    |
|                                   | satisfies a condition.           |
+-----------------------------------+----------------------------------+

### Every metamodel

Every is an expression where all "satisfies" needs to be true for it to
return true.

Every inherits all the attributes and model associations of Quantified.

### Some metamodel

Some is an expression where at least one of the "satisfies" needs to be
true for it to return true.

~Some~ inherits all the attributes and model associations of
~Quantified~.

## Examples

A good way to get a quick overview of FEEL is by example.

FEEL expressions may reference other FEEL expressions by name. Named
expressions are contained in a context. Expressions are evaluated in a
scope, which is a list of contexts in which to resolve names. The result
of the evaluation is an element in the FEEL semantic domain.

### Context

Figure 10-28 shows the boxed context used for the examples. Such a
context could arise in several ways. It could be part of the decision
logic for a single, complex decision. Or it could be a context that is
equivalent to part of a DRG as defined in clause 10.4, where *applicant,
requested product,* and *credit history* are input data instances,
*monthly income* and *monthly outgoings* are the results of other
decisions linked through information requirements, and *PMT* is a
business knowledge model.

+-------------------+-----------------+---+-------+---+-----+-------------+
| > applicant       | age             | 5 |       |   |     |             |
|                   |                 | 1 |       |   |     |             |
+===================+=================+===+=======+===+=====+=============+
|                   | maritalStatus   | \ |       |   |     |             |
|                   |                 | " |       |   |     |             |
|                   |                 | M |       |   |     |             |
|                   |                 | \ |       |   |     |             |
|                   |                 | " |       |   |     |             |
+-------------------+-----------------+---+-------+---+-----+-------------+
|                   | e               | f |       |   |     |             |
|                   | xistingCustomer | a |       |   |     |             |
|                   |                 | l |       |   |     |             |
|                   |                 | s |       |   |     |             |
|                   |                 | e |       |   |     |             |
+-------------------+-----------------+---+-------+---+-----+-------------+
|                   | monthly         | > |       |   | 10  |             |
|                   |                 |   |       |   | 000 |             |
|                   |                 | i |       |   |     |             |
|                   |                 | n |       |   |     |             |
|                   |                 | c |       |   |     |             |
|                   |                 | o |       |   |     |             |
|                   |                 | m |       |   |     |             |
|                   |                 | e |       |   |     |             |
+-------------------+-----------------+---+-------+---+-----+-------------+
|                   |                 | > |       |   | 2   |             |
|                   |                 |   |       |   | 500 |             |
|                   |                 | r |       |   |     |             |
|                   |                 | e |       |   |     |             |
|                   |                 | p |       |   |     |             |
|                   |                 | a |       |   |     |             |
|                   |                 | y |       |   |     |             |
|                   |                 | m |       |   |     |             |
|                   |                 | e |       |   |     |             |
|                   |                 | n |       |   |     |             |
|                   |                 | t |       |   |     |             |
|                   |                 | s |       |   |     |             |
+-------------------+-----------------+---+-------+---+-----+-------------+
|                   |                 | > |       |   | 3   |             |
|                   |                 |   |       |   | 000 |             |
|                   |                 | e |       |   |     |             |
|                   |                 | x |       |   |     |             |
|                   |                 | p |       |   |     |             |
|                   |                 | e |       |   |     |             |
|                   |                 | n |       |   |     |             |
|                   |                 | s |       |   |     |             |
|                   |                 | e |       |   |     |             |
|                   |                 | s |       |   |     |             |
+-------------------+-----------------+---+-------+---+-----+-------------+
| > requested       | product type    |   |       | \ |     |             |
| > product         |                 |   |       | " |     |             |
|                   |                 |   |       | S |     |             |
|                   |                 |   |       | T |     |             |
|                   |                 |   |       | A |     |             |
|                   |                 |   |       | N |     |             |
|                   |                 |   |       | D |     |             |
|                   |                 |   |       | A |     |             |
|                   |                 |   |       | R |     |             |
|                   |                 |   |       | D |     |             |
|                   |                 |   |       | L |     |             |
|                   |                 |   |       | O |     |             |
|                   |                 |   |       | A |     |             |
|                   |                 |   |       | N |     |             |
|                   |                 |   |       | \ |     |             |
|                   |                 |   |       | " |     |             |
+-------------------+-----------------+---+-------+---+-----+-------------+
|                   | rate            |   |       | 0 |     |             |
|                   |                 |   |       | . |     |             |
|                   |                 |   |       | 2 |     |             |
|                   |                 |   |       | 5 |     |             |
+-------------------+-----------------+---+-------+---+-----+-------------+
|                   | term            |   |       | 3 |     |             |
|                   |                 |   |       | 6 |     |             |
+-------------------+-----------------+---+-------+---+-----+-------------+
|                   | amount          |   |       | 1 |     |             |
|                   |                 |   |       | 0 |     |             |
|                   |                 |   |       | 0 |     |             |
|                   |                 |   |       | 0 |     |             |
|                   |                 |   |       | 0 |     |             |
|                   |                 |   |       | 0 |     |             |
|                   |                 |   |       | . |     |             |
|                   |                 |   |       | 0 |     |             |
|                   |                 |   |       | 0 |     |             |
+-------------------+-----------------+---+-------+---+-----+-------------+
| > monthly income  | applicant       |   |       |   |     |             |
|                   | .monthly.income |   |       |   |     |             |
+-------------------+-----------------+---+-------+---+-----+-------------+
| > monthly         | applicant.mont  |   |       |   |     |             |
| > outgoings       | hly.repayments, |   |       |   |     |             |
|                   | applicant.m     |   |       |   |     |             |
|                   | onthly.expenses |   |       |   |     |             |
+-------------------+-----------------+---+-------+---+-----+-------------+
| > credit history  | record date     |   | event |   |     | weight      |
+-------------------+-----------------+---+-------+---+-----+-------------+
|                   | date(           |   | \     |   |     | 100         |
|                   | \"2008-03-12\") |   | "home |   |     |             |
|                   |                 |   | mortg |   |     |             |
|                   |                 |   | age\" |   |     |             |
+-------------------+-----------------+---+-------+---+-----+-------------+
|                   | date(           |   | > \"f |   |     | 150         |
|                   | \"2011-04-01\") |   | orecl |   |     |             |
|                   |                 |   | osure |   |     |             |
|                   |                 |   | >     |   |     |             |
|                   |                 |   |  warn |   |     |             |
|                   |                 |   | ing\" |   |     |             |
+-------------------+-----------------+---+-------+---+-----+-------------+
| > PMT             | (rate, term,    |   |       |   |     |             |
|                   | amount)         |   |       |   |     |             |
+-------------------+-----------------+---+-------+---+-----+-------------+
|                   | (amount         |   |       |   |     |             |
|                   | \*rate/12) /    |   |       |   |     |             |
|                   | (1 - (1 +       |   |       |   |     |             |
|                   | rat             |   |       |   |     |             |
|                   | e/12)\*\*-term) |   |       |   |     |             |
+-------------------+-----------------+---+-------+---+-----+-------------+

**Figure 10-28: Example context**

Notice that there are 6 top-level context entries, represented by the
six rows of the table. The value of the context entry named
\'applicant\' is itself a context, and the value of the context entry
named \'monthly\' is itself a context. The value of the context entry
named \'monthly outgoings\' is a list, the value of the context entry
named \'credit history\' is a relation, *i.e.,* a list of two contexts,
one context per row. The value of the context entry named \'PMT\' is a
function with parameters \'rate\', \'term\', and \'amount\'.

The following examples use the above context. Each example has a pair of
equivalent FEEL expressions separated by a horizontal line. Both
expressions denote the same element in the semantic domain. The second
expression, the 'answer', is a literal value.

### Calculation

monthly income \* 12 120000

The context defines *monthly income* as *applicant.monthly.income*,
which is also defined in the context as 10,000. Twelve times the
*monthly income* is 120,000.

### If, In

if applicant.maritalStatus in ("M", "S") then "valid" else "not valid"
"valid"

The *in* test determines if the left-hand side expression satisfies the
list of values or ranges on the right-hand side. If satisfied, the *if*
expression returns the value of the *then* expression. Otherwise, the
value of the *else* expression is returned.

### Sum entries of a list

sum (monthly outgoings) 5500

*Monthly outgoings* is computed in the context as the list
\[*applicant.monthly.repayments, applicant.monthly.expenses*\], or
\[2500, 3000\]. The square brackets are not required to be written in
the boxed context.

### Invocation of user-defined PMT function

The PMT function defined in the context computes the monthly payments
for a given interest rate, number of months, and loan amount.

PMT (requested product . rate,\
requested product . term,\
[requested product .
amount)]{.underline}\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\
3975.982590125552338278440100112431

A function is invoked textually using a parenthesized argument list
after the function name. The arguments are defined in the context, and
are 0.25, 36, and 100,000, respectively.

### Sum weights of a recent credit history

sum (credit history\[record date \> date ("2011-01-01")\].weight\
150

This is a complex \"one-liner\" that will be useful to expand into
constituent sub-expressions:

>  built-in: *sum*
>
> o path expression ending in *.weight*
>
> ▪ filter: *\[record date \> date(\"2011-01-01 \")\]*
>
>  name resolved in context: *credit history*

An expression in square brackets following a list expression filters the
list. *Credit history* is defined in the context as a relation, that is,
a list of similar contexts. Only the last item in the relation satisfies
the filter. The first item is too old. The path expression ending in
*.weight* selects the value of the *weight* entry from the context or
list of contexts satisfied by the filter. The *weight* of the last item
in the credit history is 150. This is the only item that satisfies the
filter, so the sum is 150 as well.

### Determine if credit history contain a bankruptcy event

Some ch in credit history satisfies ch.event = "bankruptcy" false

The *some* expression determines if at least one element in a list or
relation satisfies a test. There are no bankruptcy events in the credit
history in the context.
