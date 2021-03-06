// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },
    
    getPiece: function(rowIndex, colIndex) {
      return this.get(rowIndex)[colIndex];
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
 
     // test if any columns on this board contain conflicts
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      return this.hasConflict(this.get(rowIndex));
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      return this.hasAnyConflict(this.hasRowConflictAt.bind(this));
    },
    
    hasAnyConflict: function(iterator) {
      var n = this.get('n');
      for (var i = 0; i < n; i++) {
        if (iterator(i)) {
          return true;
        }
      }
      return false;
    },

    hasConflict: function(array) {
      // receive an array input
      // return true if there is a conflict, otherwise false
      var count = 0;
      array.forEach(function(element) {
        if (element === 1) {
          count++;
        }
      });
      return count > 1;
    },

    hasAnyColConflicts: function() {
      return this.hasAnyConflict(this.hasColConflictAt.bind(this));
    },
    

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      return this.hasConflict(this.getColumn(colIndex));
    },
    
    getColumn: function(colIndex) {
      // given a colIndex, return an array
      var n = this.get('n');
      var colArray = [];
      for (var i = 0; i < n; i++) {
        colArray.push(this.get(i)[colIndex]);
      }
      return colArray;
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorIndex) {
      return this.hasConflict(this.getMajorDiagonalX(majorIndex));
    },
    
    hasMajorDiagonalConflictAtY: function(majorIndex) {
      return this.hasConflict(this.getMajorDiagonalY(majorIndex));
    },
        
    getMajorDiagonalX: function(colIndex) {
      var diagArray = [];
      var n = this.get('n');
      var rowIndex = 0;
      
      for (var i = colIndex; i < n; i++) {
        diagArray.push(this.get(rowIndex)[i]);
        rowIndex++;
      }
      return diagArray;
    },
    
    getMajorDiagonalY: function(rowIndex) {
      var diagArray = [];
      var n = this.get('n');
      var colIndex = 0;
      
      for (var i = rowIndex; i < n; i++) {
        diagArray.push(this.get(i)[colIndex]);
        colIndex++;
      }
      return diagArray;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      return this.hasAnyConflict(this.hasMajorDiagonalConflictAt.bind(this)) || this.hasAnyConflict(this.hasMajorDiagonalConflictAtY.bind(this));
    },
    //Will take an i and j value, and return a boolean true or false for a conflict at that location
    hasQueenMajorDiagonalConflictAt: function(i, j) {
      if (i >= j ) {
        return this.hasMajorDiagonalConflictAt(i - j);
      } else {
        return this.hasMajorDiagonalConflictAtY(j - i);
      }
    },
    
    hasQueenMinorDiagonalConflictAt: function(i, j) {
      if (i + j <= (n - 1)) {
        //Change
        return this.hasMinorDiagonalConflictAt(j + i);
      } else {
        return this.hasMinorDiagonalConflictAt(i + j - n + 1);
      }
    },


    getMinorDiagonalX: function(colIndex) {
      var diagArray = [];
      var n = this.get('n');
      var rowIndex = 0;
      
      for (var i = colIndex; i >= 0; i--) {
        diagArray.push(this.get(rowIndex)[i]);
        rowIndex++;
      }
      return diagArray;
    },
    
    getMinorDiagonalY: function(rowIndex) {
      var diagArray = [];
      var n = this.get('n');
      var colIndex = n - 1;
      
      for (var i = rowIndex; i < n; i++) {
        diagArray.push(this.get(i)[colIndex]);
        colIndex--;
      }
      return diagArray;
    },
    
    
    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorIndex) {
      return this.hasConflict(this.getMinorDiagonalX(minorIndex)) || this.hasConflict(this.getMinorDiagonalY(minorIndex));
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      return this.hasAnyConflict(this.hasMinorDiagonalConflictAt.bind(this));
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());


