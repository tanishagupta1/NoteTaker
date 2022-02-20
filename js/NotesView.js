export default class NotesView {
    constructor(root, { onNoteSelect, onNoteAdd, OnNoteEdit, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.OnNoteEdit = OnNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML = `
            <div class="notes_sidebar">
            <button type="button" class="notes_add">Add Note</button>
            <div class="notes_list"></div>
        </div>
        <div class="notes_preview">
            <input type="text" class="notes_head" placeholder="Enter a title..">
            <textarea class="notes_body" placeholder="Enter note text.."></textarea>
        </div>`;


        const btnAddnote = this.root.querySelector(".notes_add");
        const inptitle = this.root.querySelector(".notes_head");
        const inpbody = this.root.querySelector(".notes_body");

        btnAddnote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        [inptitle, inpbody].forEach(inputField => {
            //blur event means when user exists out of the field
            inputField.addEventListener("blur", () => {
                const updatedTitle = inptitle.value.trim();
                const updatedBody = inpbody.value.trim();
                this.OnNoteEdit(updatedTitle, updatedBody);
            });
        });


        // console.log(this._createListItemHTML(300,"Hey","I don't know what am i doing",new Date()));
        //todo hide preview
        this.updatePreview(false);
    }

    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60;
        return `
        <div class="notes_item" data-note-id="${id}">
        <div class="notes_title">${title}</div>
        <div class="notes_small_body">
        ${body.substring(0, MAX_BODY_LENGTH)}
        ${body.length > MAX_BODY_LENGTH ? "..." : ""}
        </div>
        <div class="notes_time_updated">
        ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
        </div>
        </div>  `
    }


    updateNotesList(notes) {
        const notesListContainer = this.root.querySelector(".notes_list");
        //empty list
        notesListContainer.innerHTML = "";

        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        //Adding select/delete events for each note in the list
        notesListContainer.querySelectorAll(".notes_item").forEach(notesListItem => {
            notesListItem.addEventListener("click", () => {
                this.onNoteSelect(notesListItem.dataset.noteId);
            });

            notesListItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Do you surely want to delete this note?");
                if (doDelete) {
                    this.onNoteDelete(notesListItem.dataset.noteId);
                }

            });
        });
    }

    updateActiveNote(note) {                            //defined while creating anote
        this.root.querySelector(".notes_head").value = note.title;
        this.root.querySelector(".notes_body").value = note.body;

        this.root.querySelectorAll(".notes_item").forEach(notesListItem => {
            notesListItem.classList.remove("notes_item_selected");
        });
        

        this.root.querySelector(`.notes_item[data-note-id="${note.id}"]`).classList.add("notes_item_selected");
    }

    updatePreview(visible) {
        this.root.querySelector(".notes_preview").style.visibility = visible ? "visible" : "hidden";
    }
}