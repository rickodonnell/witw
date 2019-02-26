# Things to do
## Functional
- Add the hints feature
- Add a final reveal to puzzles
- Allow authoring of puzzles
  - Add authors to data model
  - Provide a UI for uploading puzzles
- Allow ratings of puzzles
  - Difficulty
  - Fun
- Add moderating of authored puzzles
  - Provide a UI to approve beforehand
- Present puzzles in some sort of order
  - Don't repeat puzzles
  - Allow filtering of puzzles
    - By rating
    - By author
    - By location
    - By date added

## Technical
- Move the data to a proper database
- Create REST endpoints to the data
- Implement the UI in a proper framework
- Smaller things
  - Get consistent naming between "puzzles" and "questions"
  - Add fields to questions
    - Author
    - Date added
  - Add fields to location
    - Active vs Inactive (past?)
    - More guid-like ID
