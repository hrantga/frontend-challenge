window.onload = start;

function start() {
    window.pazzleNewGame = new PuzzleGame('puzzle');
    
}

function PuzzleGame(className) {
    let puzzleData = [];
    let boardLength;
    let colSize;
    let rowSize;
    let elWidth;
    let elHeight;
    /*
      init function fill cell info to puzzledData array,
      set cells position x, y and adding event listener on cell click
    */
    function init() {
        const board = document.getElementsByClassName(className)[0];
        boardLength = board.children.length;
        rowSize = colSize = Math.sqrt(boardLength + 1);
        elWidth = elHeight = 100 / rowSize;
        for (let [index, el] of Object.entries(board.children)) {
            const value = parseInt(el.textContent);
            el.addEventListener('click', onItemClick);
            el.style.width = elWidth + '%';
            el.style.height = elHeight + '%';
            const newItem = {
                el,
                value
            };
            _move(el, index)
            puzzleData.push(newItem);
        }

        puzzleData.push({
            el: null,
            value: null
        });
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

    /* 
      moveItem function call _move and swaping selected item and empty item in puzzleData array
    */
    function moveItem(item, newIndex, itemIndex) {
        _move(item.el, newIndex);
        [puzzleData[itemIndex], puzzleData[newIndex]] = [puzzleData[newIndex], puzzleData[itemIndex]];
        checkGameOver();
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
      check gave over or not
    */
    function checkGameOver() {
        let success = true;
        for (const [index, el] of puzzleData.entries()) {
            if (el.value == null) {
                continue;
            }
            if (el.value !== +index + 1) {
                success = false;
                break;
            }
        }
        if (success) console.log('Game Over!')
    }

    /* 
      schuffle puzzleData array
    */
    this.schufflePuzzle = () => {
        puzzleData = puzzleData.sort(() => Math.random() - 0.5);
        puzzleData.forEach((item, index) => {
          if(item.value != null)  _move(item.el, index)
        })
    }

    /* 
      gettin column and row index 
    */
    function getRowCol(index) {
        return [index % colSize, parseInt(index / rowSize)];
    }

    /*
      these function reponsible for recalculate cells x,y depence on screen changes
    */
    function setCellPositon() {
        puzzleData.forEach((item, index) => {
            if (item.value) _move(item.el, index);
        })
    }
    const screen = window.matchMedia("(max-width: 768px)");
    screen.addEventListener('change', function (event) {
        setCellPositon();
    });

    init();
}

// document.addEventListener('DOMContentLoaded', function (event) {
    // window.pazzleNewGame = 
// })