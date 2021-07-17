function PuzzleGame(className) {
    let puzzleData = [];
    let boardLength;
    let colSize;
    let rowSize;

    /*
      init function fill cell info to puzzledData array,
      set cells position x, y and adding event listener on cell click
    */
    function init() {
        const board = document.getElementsByClassName(className)[0];
        boardLength = board.children.length;
        rowSize = colSize = Math.sqrt(boardLength + 1);
        for (let [index, el] of Object.entries(board.children)) {
            const value = parseInt(el.textContent);
            el.addEventListener('click', onItemClick);
            const [newRow, newCol] = getRowCol(index);
            const { offsetWidth, offsetHeight } = el;
            const newPositionX = newRow * offsetHeight;
            const newPositionY = newCol * offsetWidth;
            console.log(newPositionX, newPositionY);
            el.style.left = newPositionX + 'px';
            el.style.top = newPositionY + 'px';
            const newItem = {
                el,
                index,
                value
            };
            _move(el, index)
            puzzleData.push(newItem);
        }

        puzzleData.push({
            el: null,
            index: boardLength,
            value: null
        });
        sort();
    }


    function sort() {
        puzzleData = puzzleData.sort((a, b) => {
            return a.index - b.index;
        })
    }

    /*
      cell click handeler which finding selected item, index amd passing to the possibleMove function
    */
    function onItemClick(ev) {
        const itemIndex = puzzleData.findIndex(item => item.el === ev.currentTarget);
        const possibleMoveIndex = possibleMove(itemIndex);
        if (possibleMoveIndex === false) {
            return;
        }

        moveItem(puzzleData[itemIndex], possibleMoveIndex, itemIndex);
    }

    /*
      possibleMove function checking possible step for selected item
    */
    function possibleMove(itemIndex) {
        if (itemIndex + 1 <= boardLength && puzzleData[itemIndex + 1].value == null) {
            return itemIndex + 1;
        }

        if (itemIndex - 1 >= 0 && puzzleData[itemIndex - 1].value == null) {
            return itemIndex - 1;
        }

        if (itemIndex - colSize >= 0 && puzzleData[itemIndex - colSize].value == null) {
            return itemIndex - colSize;
        }

        if (itemIndex + colSize <= boardLength && puzzleData[itemIndex + colSize].value == null) {
            return itemIndex + colSize;
        }

        return false;

    }

    function destroy() {
        puzzleData.forEach(item => {
            item.el.removeEventListener("click", onItemClick);
        })
    }

    /* 
      moveItem function call _move and swaping selected item and empty item in puzzleData array
    */
    function moveItem(item, newIndex, itemIndex) {
        _move(item.el, newIndex);
        item.index = newIndex;
        [puzzleData[itemIndex], puzzleData[newIndex]] = [puzzleData[newIndex], puzzleData[itemIndex]];
    }

    /*
      _move function set new postion for selected item
    */
    function _move(item, newIndex) {
        const [newRow, newCol] = getRowCol(newIndex);
        const { offsetWidth, offsetHeight } = item;
        const newPositionX = newRow * offsetWidth;
        const newPositionY = newCol * offsetHeight;
        item.style.left = newPositionX + 'px';
        item.style.top = newPositionY + 'px';
    }

    /* 
      gettin column and row index 
    */
    function getRowCol(index) {
        return [index % colSize, parseInt(index / rowSize)];
    }

    init();
}

document.addEventListener('DOMContentLoaded', function (event) {
    PuzzleGame('puzzle')
})