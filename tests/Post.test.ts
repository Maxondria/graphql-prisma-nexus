import { createTestContext } from './__helpers';

const ctx = createTestContext();

it('ensures a draft can be created and published', async () => {
  const draftResult = await ctx.client.send(`
  mutation {
    createDraft(title: "Nexus 2", body: "No more Yoga updates"){
      id
      title
      body
      published
    }
  }
  `);

  expect(draftResult).toMatchInlineSnapshot(`
    Object {
      "createDraft": Object {
        "body": "No more Yoga updates",
        "id": 2,
        "published": false,
        "title": "Nexus 2",
      },
    }
  `);

  const publishResult = await ctx.client.send(
    `
  mutation publishDraft($draftId: Int!) {
    publish(draftId: $draftId){
      id
      title
      body
      published
    }
  }
  `,
    { draftId: draftResult.createDraft.id },
  );

  expect(publishResult).toMatchInlineSnapshot(`
    Object {
      "publish": Object {
        "body": "No more Yoga updates",
        "id": 2,
        "published": true,
        "title": "Nexus 2",
      },
    }
  `);
});
