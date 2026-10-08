# Machine Learning (ML) Folder Documentation

## 1. Purpose

The `ml/` folder contains data-preparation and data-quality scripts for
the **Digital Health Twin for Personalized Health Monitoring** project.
The current scripts help inspect the selected NHANES 2021--2023 data
before later health-profile analysis and machine-learning experiments.

**Current scope:** These scripts prepare and audit data. They do not
train a machine-learning model, diagnose a patient, or provide clinical
recommendations.

## 2. Folder structure

``` text
ml/
└── preprocessing/
    ├── analyze_preprocessing.py
    ├── check_column.py
    └── feature_audit.py
```

This documentation is based on the current filenames and previously
observed outputs. If script logic changes, update this file to match the
code.

## 3. Dataset context

The workflow uses selected NHANES 2021--2023 component files, stored
under `data/raw/`. The merged and generated outputs are stored under
`data/processed/`.

  Source file     General contents
  --------------- --------------------------------------------
  `DEMO_L.xpt`    Demographic information
  `BMX_L.xpt`     Body measurements
  `BPXO_L.xpt`    Blood pressure measurements
  `DIQ_L.xpt`     Diabetes-related questionnaire information
  `GHB_L.xpt`     Glycohemoglobin / HbA1c measurement
  `TCHOL_L.xpt`   Total cholesterol
  `HSQ_L.xpt`     General health status

Where applicable, the components are joined using `SEQN`, the
participant identifier. The merged dataset previously observed contained
**11,933 rows and 73 columns**; counts can change if the source data or
processing logic changes.

NHANES is a survey dataset, not a continuous real-time stream. The
project can demonstrate processing updated records when new data becomes
available, but should not claim live wearable monitoring based on NHANES
alone.

## 4. Script documentation

### 4.1 `analyze_preprocessing.py`

**Purpose:** Analyze missing values in the merged dataset. Missingness
analysis helps determine which fields are complete and which need
investigation before feature selection or modeling.

**Expected input**

``` text
data/processed/nhanes_merged.csv
```

**Expected output**

``` text
data/processed/missing_values_report.csv
```

The observed report contains: - `column`: variable name. -
`missing_count`: number of rows with missing values. -
`missing_percent`: percentage of rows with missing values.

**Interpretation:** A high missing percentage is a reason to investigate
a variable, not an automatic reason to delete it. Some NHANES
measurements and questionnaire responses apply only to specific age
groups or survey conditions. Missingness can therefore reflect the
survey design rather than a failed merge.

**Run from the repository root**

``` powershell
python ml/preprocessing/analyze_preprocessing.py
```

**Cautions** 1. Confirm the merged CSV exists before running the script.
2. Review the report before deciding how to handle missing values. 3. Do
not replace every missing value with zero automatically. 4. Check
official NHANES documentation for variable-specific eligibility and
response codes.

### 4.2 `check_column.py`

**Purpose:** Check selected columns in source and/or processed NHANES
data. This diagnostic helper can help identify misspelled or unavailable
fields and examine how much non-missing data is available.

**Role in the workflow:** Before building a health profile or selecting
features, verify that expected columns exist and contain usable
observations. A column check can reveal: - A misspelled or unavailable
column name. - A variable with many missing values. - A field that
belongs to a different source component. - A variable that needs
interpretation before use.

**Run from the repository root**

``` powershell
python ml/preprocessing/check_column.py
```

Review the terminal output and compare names with the official NHANES
component documentation.

**Note:** This is a diagnostic utility, not a data-cleaning or
model-training step. Its exact checks depend on the variables and logic
defined in the script; keep this section updated if that logic changes.

### 4.3 `feature_audit.py`

**Purpose:** Audit candidate health-profile variables to assess observed
data availability and variation before selecting features for later
analysis.

**Expected input**

``` text
data/processed/nhanes_merged.csv
```

**Expected output**

``` text
data/processed/candidate_feature_audit.csv
```

The observed report includes:

  -----------------------------------------------------------------------
  Field                               Meaning
  ----------------------------------- -----------------------------------
  `variable`                          Candidate variable name

  `non_missing_count`                 Rows with an observed value

  `missing_count`                     Rows with a missing value

  `missing_percent`                   Percentage of rows with a missing
                                      value

  `unique_values`                     Number of distinct observed values
                                      reported by the audit
  -----------------------------------------------------------------------

**Candidate variables observed**

  Variable     General interpretation
  ------------ -----------------------------------------
  `RIDAGEYR`   Age in years
  `RIAGENDR`   Sex variable in NHANES
  `RIDRETH3`   Race/ethnicity category
  `BMXWT`      Weight
  `BMXHT`      Height
  `BMXBMI`     Body mass index
  `BMXWAIST`   Waist circumference
  `BPXOSY1`    First systolic blood-pressure reading
  `BPXODI1`    First diastolic blood-pressure reading
  `DIQ010`     Diabetes questionnaire variable
  `DIQ070`     Diabetes-related questionnaire variable
  `DIQ050`     Diabetes-related questionnaire variable
  `LBXGH`      Glycohemoglobin / HbA1c
  `LBXTC`      Total cholesterol
  `HSQ590`     General-health questionnaire variable

Confirm each variable's meaning, units, and response codes in the
official NHANES documentation. Questionnaire variables may include
special codes such as refused or don't know, depending on the variable.
Do not assume every distinct code is a valid clinical category.

**Previously observed audit results**

The audit previously reported a dataset of **11,933 rows × 73 columns**.
Selected results were:

  Variable       Non-missing rows   Missing percentage
  ------------ ------------------ --------------------
  `RIDAGEYR`               11,933                0.00%
  `RIAGENDR`               11,933                0.00%
  `RIDRETH3`               11,933                0.00%
  `DIQ010`                 11,740                1.62%
  `BMXWT`                   8,754               26.64%
  `BMXHT`                   8,499               28.78%
  `BMXBMI`                  8,471               29.01%
  `BMXWAIST`                8,190               31.37%
  `BPXOSY1`                 7,517               37.01%
  `BPXODI1`                 7,517               37.01%
  `LBXTC`                   6,890               42.26%
  `LBXGH`                   6,715               43.73%
  `HSQ590`                  5,751               51.81%

These values describe the generated dataset at the time of the audit;
they are not guaranteed to remain the same after source or code changes.

**Run from the repository root**

``` powershell
python ml/preprocessing/feature_audit.py
```

**Feature-selection cautions** - `SEQN` is a join identifier and should
not be used as a predictive health feature. - Decide and document
whether demographic fields belong in the intended analysis. - Consider
missingness together with eligibility rules and intended use. - The
audit does not establish that a feature is medically appropriate,
unbiased, predictive, or safe. - Before modeling, define the target
variable and document treatment of missing values, units, and special
response codes.

## 5. Recommended workflow

Run commands from the repository root, where the `data/` and `ml/`
folders are located.

1.  **Prepare and merge source components.** The broader preprocessing
    step reads the NHANES XPT files and creates
    `data/processed/nhanes_merged.csv`.

2.  **Analyze missing values.**

    ``` powershell
    python ml/preprocessing/analyze_preprocessing.py
    ```

3.  **Check selected columns.**

    ``` powershell
    python ml/preprocessing/check_column.py
    ```

4.  **Audit candidate features.**

    ``` powershell
    python ml/preprocessing/feature_audit.py
    ```

5.  **Review the reports** and check variable definitions and codes
    against official NHANES documentation.

6.  **Document feature decisions** before model development.

The diagnostic scripts can be run in a different order if needed, but
the merged CSV must exist before scripts that read it can run.

## 6. Generated files and handling

  ----------------------------------------------------------------------------------------------
  File                                           Purpose                 Recommended handling
  ---------------------------------------------- ----------------------- -----------------------
  `data/processed/nhanes_merged.csv`             Merged                  Keep out of a public
                                                 participant-level       repository unless
                                                 records                 redistribution and
                                                                         privacy requirements
                                                                         have been checked

  `data/processed/missing_values_report.csv`     Missingness summary by  Review before sharing
                                                 column                  

  `data/processed/candidate_feature_audit.csv`   Candidate-feature       Review before sharing
                                                 quality summary         

  `data/processed/preprocessing_report.txt`      Summary from the        Review before sharing
                                                 merge/preprocessing     
                                                 step                    
  ----------------------------------------------------------------------------------------------

The report CSVs are summaries but should still be reviewed before
publishing. Configure `.gitignore` to exclude raw XPT files and the
merged participant-level CSV. Do not commit data merely because Git
shows it as untracked.

## 7. Current limitations

1.  These scripts support inspection and preparation; they do not prove
    that the full Digital Health Twin has been implemented.
2.  NHANES is cross-sectional survey data and does not by itself provide
    continuous real-time wearable tracking.
3.  Missingness may reflect age eligibility, survey design, or
    collection conditions.
4.  Questionnaire codes need interpretation using official
    documentation.
5.  The candidate-feature audit is descriptive and does not validate a
    clinical prediction model.
6.  The scripts should not be used to generate diagnoses or treatment
    recommendations.

## 8. Future development

After preprocessing and feature definitions are verified, future work
may include: - Documented handling of missing data and special
questionnaire codes. - Feature transformation and scaling where
appropriate. - Exploratory analysis and visualization. - A clearly
defined prediction or risk-analysis task with a defensible target
variable. - Train/validation/test separation and suitable evaluation
metrics. - Bias, privacy, and limitation checks. - Integration of
validated outputs into the Digital Health Twin profile and dashboard.

These are potential next steps, not features claimed to be implemented
by the current scripts.

## 9. Troubleshooting

**`FileNotFoundError`** - Run commands from the repository root. -
Confirm that the expected input CSV exists under `data/processed/`.

**A column is missing** - Check spelling and confirm which NHANES
component contains it. - Consult the official component documentation.

**A report shows high missing percentages** - Do not automatically fill
values with zero or delete all affected rows. - Check age eligibility,
survey design, and variable documentation first.

**Output counts change** - Regenerate reports and record which source
files and code version were used.

## 10. Reproducibility and responsibility

-   Keep original source files unchanged.
-   Store generated outputs separately from raw data.
-   Keep script names and paths consistent.
-   Regenerate reports using scripts instead of editing report values
    manually.
-   Document cleaning, exclusions, transformations, and assumptions.
-   Check data-use terms and protect participant-level data before
    sharing.

------------------------------------------------------------------------

**Documentation status:** This file describes the current ML
preprocessing utilities and previously observed outputs. Update it
whenever filenames, input/output paths, variable choices, or processing
logic change.
