"""Tests for the BaseModel PynamoDB class."""

import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, date
from pynamodb.attributes import MapAttribute

# Import the BaseModel class
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../..", "aws", "src"))

from services.dynamo.base import BaseModel


class TestBaseModel:
    """Test cases for BaseModel functionality."""

    def test_attr2obj_with_list(self):
        """Test attr2obj method with list input."""
        model = BaseModel()
        test_list = [1, 2, 3]
        result = model.attr2obj(test_list)
        assert result == [1, 2, 3]

    def test_attr2obj_with_map_attribute(self):
        """Test attr2obj method with MapAttribute input."""
        model = BaseModel()

        # Create a mock MapAttribute
        mock_map = MagicMock(spec=MapAttribute)
        mock_map.attribute_values = {"key1": "value1", "key2": "value2"}

        result = model.attr2obj(mock_map)
        assert result == {"key1": "value1", "key2": "value2"}

    def test_attr2obj_with_datetime(self):
        """Test attr2obj method with datetime input."""
        model = BaseModel()
        test_datetime = datetime(2023, 1, 1, 12, 0, 0)
        result = model.attr2obj(test_datetime)
        assert result == "2023-01-01T12:00:00"

    def test_attr2obj_with_date(self):
        """Test attr2obj method with date input."""
        model = BaseModel()
        test_date = date(2023, 1, 1)
        result = model.attr2obj(test_date)
        assert result == "2023-01-01"

    def test_attr2obj_with_primitive(self):
        """Test attr2obj method with primitive input."""
        model = BaseModel()
        test_string = "test"
        result = model.attr2obj(test_string)
        assert result == "test"

    def test_as_dict(self):
        """Test as_dict method."""
        model = BaseModel()

        # Mock attribute_values
        model.attribute_values = {
            "key1": "value1",
            "key2": 123,
            "key3": datetime(2023, 1, 1, 12, 0, 0),
        }

        result = model.as_dict()
        expected = {"key1": "value1", "key2": 123, "key3": "2023-01-01T12:00:00"}
        assert result == expected

    @patch("services.dynamo.base.BaseModel.get")
    def test_get_success(self, mock_get):
        """Test get_ method when item exists."""
        mock_item = MagicMock()
        mock_get.return_value = mock_item

        result = BaseModel.get_("hash_key", "range_key")

        mock_get.assert_called_once_with("hash_key", "range_key")
        assert result == mock_item

    @patch("services.dynamo.base.BaseModel.get")
    def test_get_not_found(self, mock_get):
        """Test get_ method when item does not exist."""
        mock_get.side_effect = BaseModel.DoesNotExist()

        result = BaseModel.get_("hash_key", "range_key")

        assert result is None

    @patch("services.dynamo.base.BaseModel.query")
    def test_list_with_hash_key(self, mock_query):
        """Test list method with hash_key."""
        mock_items = [MagicMock(), MagicMock()]
        mock_query.return_value = mock_items

        result = BaseModel.list(hash_key="test_hash")

        mock_query.assert_called_once_with("test_hash")
        assert result == mock_items

    @patch("services.dynamo.base.BaseModel.scan")
    def test_list_without_hash_key(self, mock_scan):
        """Test list method without hash_key."""
        mock_items = [MagicMock(), MagicMock()]
        mock_scan.return_value = mock_items

        result = BaseModel.list()

        mock_scan.assert_called_once()
        assert result == mock_items

    @patch("services.dynamo.base.BaseModel.query")
    def test_list_with_range_key(self, mock_query):
        """Test list method with range_key."""
        mock_items = [MagicMock()]
        mock_query.return_value = mock_items

        result = BaseModel.list(hash_key="test_hash", range_key="test_range")

        mock_query.assert_called_once_with("test_hash", "test_range")
        assert result == mock_items
