import getAllPosts from '@/app/utils/posts';

describe('test utils', () => {
  test('false is false', () => {
    expect(false).toMatchInlineSnapshot(`false`);
  });

  test('get posts', async () => {
    const posts = await getAllPosts();
    expect(posts).toMatchInlineSnapshot(`
      [
        {
          "author": [
            "cullyfung",
          ],
          "content": "<h1>H1</h1>
      <h2>H2</h2>
      <h3>H3</h3>
      <h4>H4</h4>
      <h5>H5</h5>
      <h6>H6</h6>
      <p>This is a test</p>
      <pre><code class="language-javascript">const foo = 'foo'
      function test() {
        console.log(foo);
      }
      </code></pre>
      <ol>
      <li>Test</li>
      <li>test</li>
      </ol>
      <ul>
      <li>test</li>
      <li>test</li>
      </ul>
      <blockquote>
      <p>hello<br>
      world</p>
      </blockquote>
      ",
          "date": 2023-07-08T00:00:00.000Z,
          "title": "Hello",
        },
      ]
    `);
  });
});
