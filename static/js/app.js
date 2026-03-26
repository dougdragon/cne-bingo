$(function() {
  var i,
  $blocks,
  board = [],
  start_date = new Date(),
  $sheet = $('.bingo-sheet'),
  $victory = $('#victory, #victory_modal'),
  modal = UIkit.modal("#victory_box"),
  freespace = '<em>Free Space</em>',
  words = [
    "AI", "Agentic AI", "One Team", "Remote Work", "Sales",
    "Original Taste", "Route Ride",
    "Q1", "Q2", "Q3", "Q4", "Security",
    "Cyber security", "Synergy", "Email", "Phishing", "Company",
    "Market", "KnowBe4", "People & Culture", "Tableau", "Circle Back", "Priority",
    // More
    "Teams", "CoPilot", "Business", "Market Street Challenge",
    "IndyCR", "Master Data", "Auditor", "FIFA", "Monster", "Snowflake"
  ],
  // A list of winning combinations
  win_list = [
      // horiz
      [ 0, 1, 2, 3, 4],
      [ 5, 6, 7, 8, 9],
      [10,11,12,13,14],
      [15,16,17,18,19],
      [20,21,22,23,24],
      // diag
      [ 0, 6,12,18,24],
      [ 4, 8,12,16,20],
      // strange
      //[ 0, 4,12,20,24],
      //[ 2,14,10,12,22],
      // vert
      [ 0, 5,10,15,20],
      [ 1, 6,11,16,21],
      [ 2, 7,12,17,22],
      [ 3, 8,13,18,23],
      [ 4, 9,14,19,24]
  ],
  already_won = false;

  function shuffle(array) {
      // Randomly shuffle an arrays elements and return the first 25
      var tmp,
          current,
          top = array.length;

      if(top) while(--top) {
          current = Math.floor(Math.random() * (top + 1));
          tmp = array[current];
          array[current] = array[top];
          array[top] = tmp;
      }

      return array.slice(0, 25);
  };

  function draw_blocks($sheet, board, freespace) {
      // Draw blocks in the board on the $sheet. Free space will be locked
      var i,
          block = '',
          block_template = '' +
              '<div class="uk-width-1-5 uk-text-large">' +
              '    <div id="{blockid}" class="uk-panel uk-panel-box bingo-tile{lock}">' +
              '        <span><strong>{word}</strong></span>' +
              '    </div>' +
              '</div>';

      for(i = 0; i < 25; i++) {
          // Set the block id
          block = block_template.replace('{blockid}', 'block-' + i);

          // Lock the free space block
          block = block.replace('{lock}', (board[i] === freespace ? ' block-locked uk-panel-box-primary' : ''));

          // Draw the block on the screen
          $sheet.append(block.replace('{word}', board[i]));
      }
  };

  function mark_wins(win_list) {
      // Check for wins and mark them. this will lock all winning blocks
      var block,
          block_matches,
          win_chance,
          possible_wins = win_list.length,
          won = false;

      // for each win chance
      for(win_chance = 0; win_chance < possible_wins; win_chance++) {
          block_matches = 0;
          // check each block in the win chance row
          for(block = 0; block < 5; block++) {
              if($('#block-' + win_list[win_chance][block]).hasClass('uk-panel-box-primary')) {
                  block_matches++;
              }
          }
          // If we got 5 matches in the win chance then note it and lock the tiles
          if(block_matches === 5) {
              won = true;
              for(block = 0; block < 5; block++) {
                  $('#block-' + win_list[win_chance][block]).addClass('block-locked');
              }
          }
      }
      return won;
  };

  function get_time(date) {
      return ((date.getHours() < 10)? "0" :"" ) + date.getHours() + ':' +
              ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes() + ':' +
              ((date.getSeconds() < 10) ? "0" : "") + date.getSeconds();
  }

  // Scramble the words
  board = shuffle(words);
  // Set the middle tile to the free space
  board[12] = freespace;
  // Draw the blocks on the sheet
  draw_blocks($sheet, board, freespace);

  $blocks = $('.uk-panel');
  $blocks.height($blocks.width()).css('font-size', $blocks.height() / 6);
  $blocks.on('click', function() {
      var $this = $(this);
      if(!$this.hasClass('block-locked')) {
          if($this.is('.uk-panel-box-primary')) {
              $this.removeClass('uk-panel-box-primary');
          } else {
              $this.addClass('uk-panel-box-primary');
              var won = mark_wins(win_list);

              if(won && !already_won) {
                  var date = new Date();

                  already_won = true;
                  $victory.append(
                      '<p>Started at: <time datetime="' + start_date.getUTCDate() +
                      '">' + get_time(start_date) + '</time>. Victory at <time datetime="' +
                      date.getUTCDate() + '">' + get_time(date)+ '</time>!</p>');
                  modal.show();
              }
          }
      }
  });

  // Keep block width and height the same
  $(window).on('resize', function() {
      $blocks.height($blocks.width()).css('font-size', $blocks.height() / 6);
  });
});
