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
        return db.posts.filter((post) => !post.published);
      },
    });

    t.list.field('posts', {
      type: 'Post',
      nullable: false,
      resolve(_root, _args, { db }) {
        return db.posts.filter((post) => post.published);
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
      resolve(_root, args, { db }) {
        const draft = {
          id: db.posts.length + 1,
          title: args.title,
          body: args.body,
          published: false,
        };
        db.posts.push(draft);
        return draft;
      },
    });

    t.field('publish', {
      type: 'Post',
      nullable: false,
      args: {
        draftId: schema.intArg({ required: true }),
      },
      resolve(_root, args, { db }) {
        const drapftToPublish = db.posts.find(
          (post) => post.id === args.draftId,
        );
        if (!drapftToPublish) {
          throw new Error(`Could not find draft with id: ${args.draftId}`);
        }
        drapftToPublish.published = true;
        return drapftToPublish;
      },
    });
  },
});
