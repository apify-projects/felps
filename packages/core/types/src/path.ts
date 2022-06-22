import TB from 'ts-toolbelt';

function get<O extends object, P extends string>(object: O, path: TB.Function.AutoPath<O, P>): TB.O.Path<O, TB.S.Split<P, '.'>> {
    return object[path as string];
}

const user = {} as User;

type User = {
    name: string
    friends: User[]
}

const friendName = get(user, 'friend');
