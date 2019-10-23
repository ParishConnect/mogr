import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { Connection, Document, Model, models } from 'mongoose';
import { getParentModel } from './common/parent.model';
import { getSimpleModel } from './common/simple.model';
import { simpleResponse } from './common/simple.response';
import { SimpleType } from './common/simple.type';
import { TestCase } from './tc';

interface MultipleTestCase extends Omit<TestCase, 'model'> {
  firstModel: Model<Document>
  secondModel: Model<Document>
  firstParentModelName:string
  secondParentModelName:string
  firstChildModelName:string
  secondChildModelName:string
}

/**
 * A Ref Test Case.
 *
 * @param connection        Mongoose Connection
 * @returns                 Test Case
 */
export function multipleCase(connection: Connection): MultipleTestCase {

  const firstSimpleModel = getSimpleModel(connection, 'first');
  const firstChildModelName = firstSimpleModel.modelName;
  const firstModel = getParentModel(connection, firstSimpleModel, 'FirstParent');
  const firstParentModelName = firstModel.modelName;

  const secondSimpleModel = getSimpleModel(connection, 'second');
  const secondChildModelName = secondSimpleModel.modelName;
  const secondModel = getParentModel(connection, secondSimpleModel, 'SecondParent');
  const secondParentModelName = secondModel.modelName;

  const response = {
    child: { ...simpleResponse }
  };

  const FirstType: GraphQLObjectType = new GraphQLObjectType({
    name: 'FirstType',
    fields: () => ({
      child: {
        type: SimpleType
      }
    })
  });

  const SecondType: GraphQLObjectType = new GraphQLObjectType({
    name: 'SecondType',
    fields: () => ({
      child: {
        type: SimpleType
      }
    })
  });

  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'MultipleQueries',
      fields: () => ({
        first: {
          type: FirstType,
          resolve: () => response
        },
        second: {
          type: SecondType,
          resolve: () => response
        }
      })
    })
  });


  return {
    firstModel,
    secondModel,
    response,
    schema,
    firstParentModelName,
    secondParentModelName,
    firstChildModelName,
    secondChildModelName
  };
}
