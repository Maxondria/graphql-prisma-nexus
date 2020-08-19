import { schema } from 'nexus';

schema.objectType({
  name: 'Post',
  definition(t) {
    t.int('id');
    t.string('title');
    t.string('body');
    t.boolean('published');
  },
});

schema.extendType({
  type: 'Query',
  definition(t) {
    t.list.field('drafts', {
      type: 'Post',
      nullable: false,
      resolve(_root, _args, { db }) {
        return db.post.findMany({
          where: { published: false },
        });
      },
    });

    t.list.field('posts', {
      type: 'Post',
      nullable: false,
      async resolve(_root, _args, { db }) {
        return await db.post.findMany({
          where: { published: true },
        });
      },
    });
  },
});

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createDraft', {
      type: 'Post',
      nullable: false,
      args: {
        title: schema.stringArg({ required: true }),
        body: schema.stringArg({ required: true }),
      },
      async resolve(_root, { body, title }, { db }) {
        return await db.post.create({
          data: { title, body, published: false },
        });
      },
    });

    t.field('publish', {
      type: 'Post',
      nullable: false,
      args: {
        draftId: schema.intArg({ required: true }),
      },
      async resolve(_root, { draftId }, { db }) {
        return await db.post.update({
          where: { id: draftId },
          data: { published: true },
        });
      },
    });
  },
});
