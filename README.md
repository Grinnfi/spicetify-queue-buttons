# Queue Buttons
Add buttons to move and remove tracks in the queue panel.  
--
<table>
<tr>
<td valign="top">

### Moving tracks

<svg width="10" viewBox="0 0 16 16" fill="#189444ff">
<path d="M 6,10 V 15 H 10 V 10 H 15 V 6 H 10 V 1 H 6 V 6 H 1 v 4 z"></path>
</svg> <b>Normal Interaction</b>

&nbsp;&nbsp;&nbsp;&nbsp;Moves to <b>last</b> place in queue.

<br>
<svg width="10" viewBox="0 0 16 16" fill="#189444ff">
<path d="M 3,1 V 15 L 15,8 Z"></path>
</svg> <b><code>Shift</code> pressed</b>

&nbsp;&nbsp;&nbsp;&nbsp;Moves to <b>first</b> place in queue.

<br>

<svg width="10" viewBox="0 0 16 16" fill="#189444ff">
<path d="M9.16 1.8C8 1.85 7.03 3.38 8.17 4.44l2.05 2.05H6.3c-2.23 0-4.35 1-5.78 2.7L0 9.8v4.7l2.83-3.38A4.5 4.5 0 0 1 6.3 9.5h3.92l-2.05 2.05c-1.32 1.42.72 3.46 2.14 2.13L16 8l-5.7-5.69a1.5 1.5 0 0 0-1.14-.5"></path>
</svg>
<b><code>Ctrl</code> pressed</b>

&nbsp;&nbsp;&nbsp;&nbsp;Moves to a random place in the **middle** of the queue.

### Removing tracks

<svg width="15" viewBox="0 0 16 16" fill="#189444ff">
<path d="M5.3 3V2c0-1 .9-2 2-2h1.4c1.1 0 2 1 2 2v1h4.8v1.5h-1L13.3 14a2.3 2.3 0 0 1-2.3 2H5a2.3 2.3 0 0 1-2.3-2L1.5 4.5h-1V3zm1.5-1v1h2.5V2a1 1 0 0 0-.6-.5H7.3a1 1 0 0 0-.5.6M3 4.6l1.2 9.3a1 1 0 0 0 .8.7h6a1 1 0 0 0 .8-.7L13 4.5z"></path>
</svg>
Removes only the selected track.

<code>Delete</code> Removes all selected tracks in queue.

### Installation

1. Install [Spicetify](https://spicetify.app) and set it up according to the instructions.
2. Navigate to your Spicetify config directory via the command `spicetify config-dir`.
3. Download `queueButtons.js` and place it in `/extensions`.
4. Run `spicetify config extensions queueButtons.js` and `Spicetify apply` in terminal.

</td>

<td valign="top" width="300" >

<img src="./assets/example.gif" width="400" alt="Queue Buttons demonstration">

</td>
</tr>
</table>