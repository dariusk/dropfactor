// AI SCRIPTS, YAY!
//TODO : if you get a 1, and can't immediately use it, try to burn it, otherwise PEC
//TODO: PEC should place on the lower of the two options
//TODO: PEC should be preceeded with trying to 

// Individual strategies, prefixed with "s"
function sSimpleCombo() {
  var piece = state.getNextPiece();
  var piecePlusOne = (parseInt(state.getNextPiece())+1).toString();
  var placed = false;
  
  for (var i=0;i<7;i++) {
    // if this column has a piece 1 higher than the current piece, and has height <= the current piece value
    // then place there to set up a simple combo and break the loop
    if (columnHasBlock(i,piecePlusOne) && columnHeight(i) <= parseInt(piece)) {
      dropFinished(i);
      placed = true;
      i = 8;
    }
  }
  return placed;
}

function sClearMax() {
  var piece = state.getNextPiece();
  var placed = false;
  var potentialResults = {};
  for (var i=0;i<7;i++) {
    // if we can drop it
    var can = canDropPiece(i);
    if (can >= 0) {
      // place the piece without resolving its placement yet
      board[can][i] = piece;
      // if placing this piece causes at least 2 things to resolve push the resolution to our potentialResults array
      if (findToBeCleared().length >= 2) {
        potentialResults[i] = findToBeCleared();
        placed = true;
      }
      // remove the speculative piece for now
      board[can][i] = undefined;
    }
  }
   if (placed) {
     var max = 0;
     var maxIndex = -1;
      for(var i in potentialResults) {
        if (potentialResults.hasOwnProperty(i)) {
          if (potentialResults[i].length > max) {
            max = potentialResults[i].length;
            maxIndex = i;
          }
        }
      }
      if (maxIndex > -1) {
        dropFinished(i);
      }
      else {
        console.log("oops, something went wrong.");
        placed = false;
      }

   }
  return placed;
}

function sClearMaxNoBurn() {
  var piece = state.getNextPiece();
  var placed = false;
  var potentialResults = {};
  for (var i=0;i<7;i++) {
    // if we can drop it
    var can = canDropPiece(i);
    if (can >= 0) {
      // place the piece without resolving its placement yet
      board[can][i] = piece;
      // if placing this piece causes at least 1 thing to resolve, and it's not a 'burn',
      // push the resolution to our potentialResults array
      if (findToBeCleared().length >= 1) {
        if (findToBeCleared().length === 1) {
          if (!isBurn(i)) {
            potentialResults[i] = findToBeCleared();
            placed = true;
          }
        }
        else {
          potentialResults[i] = findToBeCleared();
          placed = true;
        }
      // remove the speculative piece for now
      board[can][i] = undefined;
      }
    }
  }
   if (placed) {
     var max = 0;
     var maxIndex = -1;
      for(var i in potentialResults) {
        if (potentialResults.hasOwnProperty(i)) {
          if (potentialResults[i].length > max) {
            max = potentialResults[i].length;
            maxIndex = i;
          }
        }
      }
      if (maxIndex > -1) {
        dropFinished(i);
      }
      else {
        console.log("oops, something went wrong.");
        placed = false;
      }

   }
  return placed;
}

function sClearMaxNaive() {
  var piece = state.getNextPiece();
  var placed = false;
  var potentialResults = {};
  for (var i=0;i<7;i++) {
    // if we can drop it
    var can = canDropPiece(i);
    if (can > 0) {
      // place the piece without resolving its placement yet
      board[can][i] = piece;
      // if placing this piece causes at least 1 thing to resolve push the resolution to our potentialResults array
      if (findToBeCleared().length >= 1) {
        potentialResults[i] = findToBeCleared();
        placed = true;
      }
      // remove the speculative piece for now
      board[can][i] = undefined;
    }
  }
   if (placed) {
     var max = 0;
     var maxIndex = -1;
      for(var i in potentialResults) {
        if (potentialResults.hasOwnProperty(i)) {
          if (potentialResults[i].length > max) {
            max = potentialResults[i].length;
            maxIndex = i;
          }
        }
      }
      if (maxIndex > -1) {
        dropFinished(i);
      }
      else {
        console.log("oops, something went wrong.");
        placed = false;
      }

   }
  return placed;
}

function sClearMaxGreedyHoriz() {
  var piece = state.getNextPiece();
  var placed = false;
  for (var i=0;i<7;i++) {
    // if we can drop it
    var can = canDropPiece(i);
    if (can > 0) {
      // place the piece without resolving its placement yet
      board[can][i] = piece;
      // if placing this piece causes at least 1 thing to resolve, AND it's horizontal, hooray, place it and break the loop
      if (findToBeCleared().length > 0 && findToBeCleared()[0] === "horizontal") {
        board[can][i] = undefined;
        dropFinished(i);
        i = 8;
        placed = true;
      }
      // otherwise, remove the speculative piece
      else {
        board[can][i] = undefined;
      }
    }
  }

}

function sClearThisBlock(block) {
  var piece = state.getNextPiece();
  var placed = false;
  // drop the piece on the first indicated block we see that we can clear out with this block
  for (var i=0;i<7;i++) {
    if (columnTopPiece(i) === block && columnHeight(i) === parseInt(piece)-1) {
      dropFinished(i);
      placed = true;
    }
  }
  return placed;
}


// AI Controllers

AIScripts = {
  AIRandom: {
    script: function() {
      dropFinished(Math.floor(Math.random()*7));
    },
    desc: "Drop pieces at random."
  },
  AIPieceEqualsColumn: {
    script: function() {
      dropFinished(parseInt(state.getNextPiece())-1);
    },
    desc: "If it's a 1, drop it in column 1. If it's 2, column 2. Etc."
  },
  AIPieceEqualsColumnRandChoice: {
    script: function() {
      // If it's a 1 or 7, flip a coin and put it on col 1 or col 7. If it's a 2 or 6, flip a coin and put it on col 2 or col 6. etc.
      var piece = parseInt(state.getNextPiece());
      if (piece === 1 || piece === 7) {
        if (Math.random() < 0.5) {
          dropFinished(0);
        }
        else {
          dropFinished(6);
        }
      }
      if (piece === 2 || piece === 6) {
        if (Math.random() < 0.5) {
          dropFinished(1);
        }
        else {
          dropFinished(5);
        }
      }
      if (piece === 3 || piece === 5) {
        if (Math.random() < 0.5) {
          dropFinished(2);
        }
        else {
          dropFinished(4);
        }
      }
      if (piece === 4) {
          dropFinished(3);
      }
    },
    desc: "If it's a 1, drop in column 1 or 7 (50/50 random chance). If it's a 2, drop in col 2 or 6 (50/50). If it's 3, drop in col 3 or 5 (50/50). If it's 4, it goes in col 4."
  },
  AIClearGreedy: {
    script: function() {
      var piece = state.getNextPiece();
      var placed = false;
      for (var i=0;i<7;i++) {
        // if we can drop it
        var can = canDropPiece(i);
        if (can > 0) {
          // place the piece without resolving its placement yet
          board[can][i] = piece;
          // if placing this piece causes at least 1 thing to resolve, hooray, place it and break the loop
          if (findToBeCleared().length > 0) {
            board[can][i] = undefined;
            dropFinished(i);
            i = 8;
            placed = true;
          }
          // otherwise, remove the speculative piece
          else {
            board[can][i] = undefined;
          }
        }
      }

      // if we didn't place anything using that algorithm, use our next best algorithm to place
        if (!placed) {
          AIScripts.AIPieceEqualsColumnRandChoice.script();
        }
    },
    desc: "Go left-to-right, testing each drop. If there's a drop that clears any piece (including the one you dropped), drop it right there and don't bother testing the rest. If you can't clear a piece, then run the AIPieceEqualsColumnRandChoice algorithm."
  },
  AIClearMax: {
    script: function() {
      if (!sClearMax()) {
        AIScripts.AIPieceEqualsColumnRandChoice.script();
      }
    },
    desc: "Test every possible drop on the board, taking note of drops that give you at least 2 cleared pieces. Of those, pick the drop that gives you the largest number of cleared pieces (not accounting for combos). If no drops give you at least 2 cleared pieces, then run the AIPieceEqualsColumnRandChoice algorithm."
  },
 AIClearMaxNoBurn: {
    script: function() {
      if (!sClearMaxNoBurn()) {
        AIScripts.AIPieceEqualsColumnRandChoice.script();
      }
    },
    desc: "Test every possible drop on the board, taking note of drops that give you at least 1 cleared piece that is not a burn. Of those, pick the drop that gives you the largest number of cleared pieces (not accounting for combos). If no drops do that, then run the AIPieceEqualsColumnRandChoice algorithm."
  },
  AIClearMaxHorizMaxVertClearNaivePEC: {
    script: function() {
      if (!sClearMaxGreedyHoriz()) {
        if (!sClearMax()) {
          if (!sClearMaxNaive()) {
            AIScripts.AIPieceEqualsColumnRandChoice.script();
          }
        }
      }
    },
    desc: "Clear maximum number of pieces with this drop, preferring the first horizontal to all vertical clears in all cases. Then AIPieceEqualsColumnRandChoice."
  },
  AIClearMaxNaive: {
    script: function() {
      if (!sClearMaxNaive()) {
        AIScripts.AIPieceEqualsColumnRandChoice.script();
      }
    },
    desc: "Test every possible drop on the board, taking note of drops that give you at least 1 cleared pieces. Of those, pick the drop that gives you the largest number of cleared pieces (not accounting for combos). If no drops give you at least 1 cleared pieces, then run the AIPieceEqualsColumnRandChoice algorithm."
  },
  AISimpleCombo: {
    script: function() {
      if (!sSimpleCombo()) {
        AIScripts.AIClearMax.script();
      }
    },
    desc: "Try to set up a simple combo (our piece is N, if there's a col that is less than or equal to N height, and contains the piece N+1, we play it here). If it can't, then do AIClearMax."
  },
  AISimpleClearMaxHalfBlockPEC: {
    script: function() {
      if (!sSimpleCombo()) {
        if (!sClearMax()) {
          if (!sClearThisBlock("h")) {
            AIScripts.AIPieceEqualsColumnRandChoice.script();
          }
        }
      }
    },
    desc: "AISimpleCombo -> AI ClearMax -> try and reveal a half block if we can -> AIPieceEqualsColumnRandChoice"
  },
  AIClearHalfClearFullSimpleComboClearMaxPEC: {
    script: function() {
      if (!sClearThisBlock("h")) {
        if (!sClearThisBlock("H")) {
          if (!sSimpleCombo()) {
            if (!sClearMax()) {
              AIScripts.AIPieceEqualsColumnRandChoice.script();
            }
          }
        }
      }
    },
    desc: "try and reveal a half block if we can -> try to reveal full block -> AISimpleCombo -> AIClearMax -> AIPieceEqualsColumnRandChoice"
  }

}


