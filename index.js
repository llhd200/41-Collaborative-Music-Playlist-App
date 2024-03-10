const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// 使用body-parser中间件解析POST请求的JSON数据
app.use(bodyParser.json());

// 模拟用户数据存储
let users = [
  { id: 1, username: 'john_doe', password: 'password123', playlists: [] },
  // 添加更多用户数据...
];

// 处理获取用户创建的所有播放列表的请求
app.get('/playlists/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.json({ playlists: user.playlists });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// 处理创建新播放列表的请求
app.post('/playlists/:userId/create', (req, res) => {
  const userId = parseInt(req.params.userId);
  const { playlistName, tracks } = req.body;

  const user = users.find((u) => u.id === userId);

  if (user) {
    const newPlaylist = { id: user.playlists.length + 1, playlistName, tracks };
    user.playlists.push(newPlaylist);
    res.json({ message: 'Playlist created successfully', playlist: newPlaylist });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// 处理分享播放列表的请求
app.post('/playlists/:playlistId/share/:friendId', (req, res) => {
  const playlistId = parseInt(req.params.playlistId);
  const friendId = parseInt(req.params.friendId);

  const user = users.find((u) => u.id === friendId);
  const playlist = users.flatMap(u => u.playlists).find((p) => p.id === playlistId);

  if (user && playlist) {
    user.playlists.push(playlist);
    res.json({ message: 'Playlist shared successfully' });
  } else {
    res.status(404).json({ message: 'User or playlist not found' });
  }
});

// 启动Express应用程序
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
