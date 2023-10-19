"""Initiate the root of the CDK construct tree. App entry point"""
from aws_cdk import App
from stacks.db_stack import RootStack

app = App()
RootStack(app)
app.synth()
